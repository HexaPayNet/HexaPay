const MOCK_API_DELAY_MS = 120
const STRICT_BACKEND_TEST_MODE = true
const MOCK_API_ENABLE_STORAGE_KEY = "hexapay-enable-mock-api"
const backendStatutoryHelpers = globalThis.HexaPayStatutory || null

function getHexaPayStore(){
  if(!window.HexaPayStore){
    throw new Error("HexaPay store is not ready yet.")
  }

  return window.HexaPayStore
}

function syncStoreApprovalTemplates(){
  try{
    getHexaPayStore().syncApprovalTemplates?.()
  } catch (error){
    console.error("Failed to sync approval templates.", error)
  }
}

function isDesktopRuntime(){
  return Boolean(window.HexaPayDesktop?.runtime?.isDesktopApp)
}

function isMockApiExplicitlyEnabled(){
  if(globalThis.HEXAPAY_ENABLE_MOCK_API === true){
    return true
  }

  try{
    return localStorage.getItem(MOCK_API_ENABLE_STORAGE_KEY) === "true"
  } catch (_error){
    return false
  }
}

function canUseDevelopmentMockApi(){
  if(STRICT_BACKEND_TEST_MODE || hasRealBackendSession() || isPackagedDesktopBuild()){
    return false
  }

  if(isDesktopRuntime()){
    return isMockApiExplicitlyEnabled()
  }

  return true
}

function createMockApiDisabledError(){
  return new Error(
    "HexaPay mock mode is disabled. Sign in to the live backend, or enable development mock mode explicitly before using offline demo data."
  )
}

function waitForMockApi(delay = MOCK_API_DELAY_MS){
  if(!canUseDevelopmentMockApi()){
    return Promise.reject(createMockApiDisabledError())
  }

  return new Promise((resolve) => {
    window.setTimeout(resolve, delay)
  })
}

function getCurrentCompanyFromApiState(state){
  return state.company.companies.find((company) => company.id === state.company.activeCompanyId) || state.company.companies[0] || null
}

function getPayrollSelection(state){
  return {
    companyId: getCurrentCompanyFromApiState(state)?.id || "company-a",
    period: state.payroll.workspace.due,
    salaryType: state.payroll.workspace.salaryType,
    departmentScope: state.payroll.workspace.department || "",
    forceRegenerate: Boolean(state.payroll.workspace.forceRegenerate)
  }
}

function getPayrollRunScopeKey(scope = ""){
  return (scope || "all").toLowerCase().replace(/[^a-z0-9]+/g, "-")
}

function getPayrollRunIdFromSelection(selection){
  return `payrun-${selection.companyId}-${selection.period}-${selection.salaryType.toLowerCase()}-${getPayrollRunScopeKey(selection.departmentScope)}`
}

function normalizeStatePayrollSalaryType(value){
  const normalizedValue = String(value || "").trim().toLowerCase()
  if(normalizedValue === "daily"){
    return "Daily"
  }

  if(normalizedValue === "weekly"){
    return "Weekly"
  }

  return "Monthly"
}

function getPayrollDepartmentById(state, departmentId){
  return state.company.departments.find((department) => String(department.id) === String(departmentId)) || null
}

function doesEmployeeMatchPayrollSalaryType(employee, salaryType){
  const normalizedPaymentType = String(employee?.paymentType || employee?.employmentType || "Monthly").trim().toLowerCase()
  return normalizedPaymentType === normalizeStatePayrollSalaryType(salaryType).toLowerCase()
}

function getCompanyEmployeesForPayroll(state, companyId, salaryType){
  return state.employees.records.filter((employee) => {
    if(employee.companyId !== companyId || employee.status !== "ACTIVE"){
      return false
    }

    return doesEmployeeMatchPayrollSalaryType(employee, salaryType)
  })
}

function getDepartmentNameForPayroll(state, departmentId){
  return state.company.departments.find((department) => department.id === departmentId)?.name || "Unassigned"
}

function getExpectedPayrollEmployeesForSelection(state, selection, departmentScopeId = null){
  return getCompanyEmployeesForPayroll(state, selection.companyId, selection.salaryType)
    .filter((employee) => {
      if(!departmentScopeId){
        return true
      }

      return String(employee.departmentId || "") === String(departmentScopeId)
    })
}

function isApprovedAttendanceLog(log){
  return Array.isArray(log.approvals) && log.approvals.every((approval) =>
    approval?.status === "approved" || approval?.approved
  )
}

function parsePayrollPeriodRange(period, salaryType){
  const normalizedSalaryType = normalizeStatePayrollSalaryType(salaryType)

  if(normalizedSalaryType === "Daily"){
    const normalizedPeriod = String(period || "").slice(0, 10)
    return normalizedPeriod
      ? { start: normalizedPeriod, end: normalizedPeriod }
      : null
  }

  if(normalizedSalaryType === "Weekly"){
    const match = /^(\d{4})-W(\d{2})$/.exec(String(period || ""))
    if(!match){
      return null
    }

    const year = Number(match[1])
    const week = Number(match[2])
    const simple = new Date(Date.UTC(year, 0, 1 + ((week - 1) * 7)))
    const day = simple.getUTCDay() || 7
    const start = new Date(simple)
    if(day <= 4){
      start.setUTCDate(simple.getUTCDate() - day + 1)
    } else {
      start.setUTCDate(simple.getUTCDate() + 8 - day)
    }
    const end = new Date(start)
    end.setUTCDate(start.getUTCDate() + 6)
    return {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10)
    }
  }

  const normalizedPeriod = String(period || "").slice(0, 7)
  if(!normalizedPeriod){
    return null
  }

  return {
    start: `${normalizedPeriod}-01`,
    end: `${normalizedPeriod}-31`
  }
}

function getApprovedAttendanceDaysForPeriod(state, employeeId, period, salaryType){
  const range = parsePayrollPeriodRange(period, salaryType)
  if(!range){
    return 0
  }

  return state.attendance.records.filter((log) => {
    const logDate = String(log.date || "").slice(0, 10)
    return String(log.employeeId) === String(employeeId) &&
      logDate >= range.start &&
      logDate <= range.end &&
      isApprovedAttendanceLog(log)
  }).length
}

function normalizeEmployeePaymentBasis(paymentType, paymentBasis){
  const normalizedPaymentType = String(paymentType || "Monthly").trim().toLowerCase()
  if(normalizedPaymentType === "daily"){
    return "attendance_dependent"
  }

  return String(paymentBasis || "").trim().toLowerCase() === "attendance_dependent"
    ? "attendance_dependent"
    : "standard"
}

function calculatePayrollBaseSalaryForEmployee(state, employee, selection){
  const paymentType = String(employee?.paymentType || employee?.employmentType || "Monthly").trim().toLowerCase()
  const paymentBasis = normalizeEmployeePaymentBasis(paymentType, employee?.paymentBasis)
  const attendanceDays = getApprovedAttendanceDaysForPeriod(state, employee.id, selection.period, selection.salaryType)

  if(paymentType === "daily"){
    return Number(employee.salaryAmount || 0) * attendanceDays
  }

  if(paymentBasis === "attendance_dependent"){
    const divisor = paymentType === "weekly" ? 7 : 30
    return Number(((Number(employee.salaryAmount || 0) / divisor) * attendanceDays).toFixed(2))
  }

  return Number(employee.salaryAmount || 0)
}

function calculatePayrollAllowancesForEmployee(employee, selection){
  if(selection.salaryType !== "Monthly"){
    return 0
  }

  return employee.status === "ACTIVE" ? 12000 : 0
}

function calculatePayrollDeductionsForEmployee(baseSalary, allowances = 0){
  if(backendStatutoryHelpers?.calculatePayrollPreview){
    return Number(backendStatutoryHelpers.calculatePayrollPreview({
      incomeItems: [
        {
          label: "Basic Salary",
          amount: Number(baseSalary || 0),
          taxable: true,
          includedInGrossPay: true,
          category: "basic_salary"
        },
        {
          label: "Allowance",
          amount: Number(allowances || 0),
          taxable: true,
          includedInGrossPay: true,
          category: "allowance"
        }
      ]
    })?.deductions?.totalEmployeeDeductions || 0)
  }

  return Math.round(Number(baseSalary || 0) * 0.12)
}

function calculatePayrollNetPay(item){
  return Number(item.baseSalary || 0) - Number(item.deductions || 0) + Number(item.allowances || 0)
}

function buildPayrollItemsForSelection(state, selection, runId){
  return getCompanyEmployeesForPayroll(state, selection.companyId, selection.salaryType)
    .filter((employee) => {
      if(!selection.departmentScope){
        return true
      }

      return String(employee.departmentId || "") === String(selection.departmentScope)
    })
    .map((employee) => {
      const paymentType = String(employee?.paymentType || employee?.employmentType || "Monthly").trim().toLowerCase()
      const paymentBasis = normalizeEmployeePaymentBasis(paymentType, employee?.paymentBasis)
      const attendanceDays = paymentType === "daily" || paymentBasis === "attendance_dependent"
        ? getApprovedAttendanceDaysForPeriod(state, employee.id, selection.period, selection.salaryType)
        : 0
      const baseSalary = calculatePayrollBaseSalaryForEmployee(state, employee, selection)
      const allowances = calculatePayrollAllowancesForEmployee(employee, selection)
      const deductions = calculatePayrollDeductionsForEmployee(baseSalary, allowances)

      return createPayrollItemModel({
        id: `payitem-${employee.id}-${selection.period}-${selection.salaryType.toLowerCase()}`,
        runId,
        companyId: employee.companyId,
        employeeId: employee.id,
        departmentId: employee.departmentId,
        period: selection.period,
        salaryType: selection.salaryType,
        attendanceDays,
        baseSalary,
        grossPay: Number(baseSalary || 0) + Number(allowances || 0),
        taxablePay: Number(baseSalary || 0) + Number(allowances || 0),
        deductions,
        allowances,
        netPay: calculatePayrollNetPay({ baseSalary, deductions, allowances }),
        approvalStatus: employee.payrollStatus || "pending",
        signed: false
      })
    })
}

function calculatePayrollRunTotals(items){
  return items.reduce((totals, item) => {
    totals.baseSalary += Number(item.baseSalary || 0)
    totals.deductions += Number(item.deductions || 0)
    totals.allowances += Number(item.allowances || 0)
    totals.netPay += Number(item.netPay || 0)
    return totals
  }, {
    baseSalary: 0,
    deductions: 0,
    allowances: 0,
    netPay: 0
  })
}

function resolveApproverUserId(state, approvalTemplate){
  const approverName = String(approvalTemplate.approver || "").trim().toLowerCase()
  if(!approverName){
    return ""
  }

  return state.auth.users.find((user) =>
    String(user.displayName || "").trim().toLowerCase() === approverName
  )?.id || ""
}

function getApprovalMetadataStatus(approval){
  if(!approval){
    return "pending"
  }

  if(approval.status){
    return approval.status
  }

  return approval.approved ? "approved" : "pending"
}

function slugifyApprovalKey(value){
  return String(value || "approval")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "approval"
}

function createWorkflowApprovalMetadata(state, approvalTemplate, existingApproval = null, options = {}){
  const { idPrefix = "approval", fallbackKey = "" } = options
  const approverId = existingApproval?.approverId || resolveApproverUserId(state, approvalTemplate)
  const approvalKey = approverId || approvalTemplate.approver || fallbackKey

  return {
    id: existingApproval?.id || `${idPrefix}-${slugifyApprovalKey(approvalKey)}`,
    approverId,
    approverName: approvalTemplate.approver,
    role: approvalTemplate.role,
    status: getApprovalMetadataStatus(existingApproval),
    approvedAt: existingApproval?.approvedAt || null,
    rejectedAt: existingApproval?.rejectedAt || null,
    rejectionReason: existingApproval?.rejectionReason || ""
  }
}

function createPayrollApprovalMetadata(state, approvalTemplate, existingApproval = null){
  return createWorkflowApprovalMetadata(state, approvalTemplate, existingApproval, {
    idPrefix: "payapproval"
  })
}

function normalizeRecordApprovals(state, approvals = [], options = {}){
  const { idPrefix = "approval", fallbackKey = "" } = options

  return approvals.map((approval, index) => createWorkflowApprovalMetadata(state, {
    approver: approval.approverName || approval.approver,
    role: approval.role
  }, approval, {
    idPrefix,
    fallbackKey: `${fallbackKey}-${index}`
  }))
}

function updateRecordApprovals(state, approvals, approverId, nextStatus, reason = "", options = {}){
  const normalizedApprovals = normalizeRecordApprovals(state, approvals, options)
  const approvalIndex = normalizedApprovals.findIndex((approval) => approval.approverId === approverId)

  if(approvalIndex < 0){
    throw new Error("Approver is not assigned to this workflow.")
  }

  const approval = normalizedApprovals[approvalIndex]
  if(approval.status !== "pending"){
    return {
      approvals: normalizedApprovals,
      approval,
      status: derivePayrollRunStatus(normalizedApprovals)
    }
  }

  normalizedApprovals[approvalIndex] = {
    ...approval,
    status: nextStatus,
    approvedAt: nextStatus === "approved" ? new Date().toISOString() : null,
    rejectedAt: nextStatus === "rejected" ? new Date().toISOString() : null,
    rejectionReason: nextStatus === "rejected" ? (reason || "") : ""
  }

  return {
    approvals: normalizedApprovals,
    approval: normalizedApprovals[approvalIndex],
    status: derivePayrollRunStatus(normalizedApprovals)
  }
}

function mergePayrollApprovals(state, existingRun){
  const templates = state.payroll.workspace.approvals || []

  return templates.map((template) => {
    const approverId = resolveApproverUserId(state, template)
    const existingApproval = existingRun?.approvals?.find((approval) =>
      (approverId && approval.approverId === approverId) ||
      String(approval.approverName || "").trim().toLowerCase() === String(template.approver || "").trim().toLowerCase()
    )

    return createPayrollApprovalMetadata(state, template, existingApproval)
  })
}

function derivePayrollRunStatus(approvals = []){
  if(approvals.some((approval) => approval.status === "rejected")){
    return "rejected"
  }

  if(approvals.length && approvals.every((approval) => approval.status === "approved")){
    return "approved"
  }

  return "pending_approval"
}

function buildPayrollRunRecord(state, selection, runId, items, existingRun = null){
  const approvals = mergePayrollApprovals(state, existingRun)

  return createPayrollRunModel({
    id: runId,
    companyId: selection.companyId,
    period: selection.period,
    salaryType: selection.salaryType,
    departmentScope: selection.departmentScope,
    status: derivePayrollRunStatus(approvals),
    approvals,
    itemIds: items.map((item) => item.id),
    generatedByUserId: state.auth.currentUserId || "",
    currencyCode: getCurrentCompanyFromApiState(state)?.currency || "KES",
    totals: calculatePayrollRunTotals(items),
    generatedAt: new Date().toISOString()
  })
}

function getPayrollRunPayloadFromStore(store, runId){
  const run = store.listPayrollRuns().find((item) => item.id === runId)
  if(!run){
    return null
  }

  return {
    run,
    items: store.listPayrollItems().filter((item) => item.runId === runId)
  }
}

function getWorkflowApprovalTemplates(state, workflowType){
  if(workflowType === "structure"){
    return state.payroll.workspace.structureApprovals || []
  }

  if(workflowType === "calendar"){
    return state.payroll.workspace.calendarApprovals || []
  }

  throw new Error(`Unsupported workflow type: ${workflowType}`)
}

function setWorkflowApprovalTemplates(state, workflowType, approvals){
  if(workflowType === "structure"){
    state.payroll.workspace.structureApprovals = approvals
    return
  }

  if(workflowType === "calendar"){
    state.payroll.workspace.calendarApprovals = approvals
    return
  }

  throw new Error(`Unsupported workflow type: ${workflowType}`)
}

function normalizeWorkflowApprovals(state, workflowType){
  const templates = getWorkflowApprovalTemplates(state, workflowType)

  return templates.map((template) => {
    const existingApproval = template.approverName || template.approverId || template.status
      ? template
      : null

    return createPayrollApprovalMetadata(state, {
      approver: template.approverName || template.approver,
      role: template.role
    }, existingApproval)
  })
}

function getWorkflowApprovalState(state, workflowType){
  const approvals = normalizeWorkflowApprovals(state, workflowType)
  setWorkflowApprovalTemplates(state, workflowType, approvals)
  return {
    workflowType,
    status: derivePayrollRunStatus(approvals),
    approvals
  }
}

function updateWorkflowApprovalState(state, workflowType, approverId, nextStatus, reason = ""){
  const approvalState = getWorkflowApprovalState(state, workflowType)
  const approvalIndex = approvalState.approvals.findIndex((approval) => approval.approverId === approverId)

  if(approvalIndex < 0){
    throw new Error("Approver is not assigned to this approval workflow.")
  }

  const approval = approvalState.approvals[approvalIndex]
  if(approval.status !== "pending"){
    return approvalState
  }

  approvalState.approvals[approvalIndex] = {
    ...approval,
    status: nextStatus,
    approvedAt: nextStatus === "approved" ? new Date().toISOString() : null,
    rejectedAt: nextStatus === "rejected" ? new Date().toISOString() : null,
    rejectionReason: nextStatus === "rejected" ? (reason || "") : ""
  }
  approvalState.status = derivePayrollRunStatus(approvalState.approvals)
  setWorkflowApprovalTemplates(state, workflowType, approvalState.approvals)

  return approvalState
}

function resetWorkflowApprovalState(state, workflowType){
  const approvalState = getWorkflowApprovalState(state, workflowType)
  const approvals = approvalState.approvals.map((approval) => ({
    ...approval,
    status: "pending",
    approvedAt: null,
    rejectedAt: null,
    rejectionReason: ""
  }))

  setWorkflowApprovalTemplates(state, workflowType, approvals)

  return {
    workflowType,
    status: derivePayrollRunStatus(approvals),
    approvals
  }
}

function getAttendanceLogContextFromStore(store, logId){
  const state = store.getState()
  const recordIndex = state.attendance.records.findIndex((log) => String(log.id) === String(logId))
  if(recordIndex < 0){
    return null
  }

  const record = state.attendance.records[recordIndex]
  const approvals = normalizeRecordApprovals(state, record.approvals, {
    idPrefix: "attendance-approval",
    fallbackKey: String(logId)
  })
  const normalizedRecord = {
    ...record,
    approvals
  }

  state.attendance.records[recordIndex] = normalizedRecord

  return {
    state,
    recordIndex,
    log: normalizedRecord,
    status: derivePayrollRunStatus(approvals)
  }
}

function deriveLeaveRequestStatus(approvals){
  const approvalStatus = derivePayrollRunStatus(approvals)

  if(approvalStatus === "approved"){
    return "Active"
  }

  if(approvalStatus === "rejected"){
    return "Rejected"
  }

  return "Pending"
}

function getLeaveRequestContextFromStore(store, requestId){
  const state = store.getState()
  const recordIndex = state.leave.records.findIndex((request) => String(request.id) === String(requestId))
  if(recordIndex < 0){
    return null
  }

  const record = state.leave.records[recordIndex]
  const approvals = normalizeRecordApprovals(state, record.approvals, {
    idPrefix: "leave-approval",
    fallbackKey: String(requestId)
  })
  const normalizedRecord = {
    ...record,
    approvals,
    status: deriveLeaveRequestStatus(approvals)
  }

  state.leave.records[recordIndex] = normalizedRecord

  return {
    state,
    recordIndex,
    request: normalizedRecord,
    approvalStatus: derivePayrollRunStatus(approvals)
  }
}

const DEFAULT_BACKEND_API_BASE_URL = "http://127.0.0.1:4000/api/v1"
const BACKEND_SESSION_STORAGE_KEY = "hexapay-live-backend-session"
let backendAuthRefreshInFlight = null

function normalizeBackendApiBaseUrl(value){
  const trimmedValue = String(value || "").trim()
  if(!trimmedValue){
    return DEFAULT_BACKEND_API_BASE_URL
  }

  const withoutTrailingSlash = trimmedValue.replace(/\/+$/, "")
  return /\/api\/v1$/i.test(withoutTrailingSlash)
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api/v1`
}

function resolveBackendApiBaseUrl(){
  const desktopRuntimeConfig = window.HexaPayDesktop?.runtime || {}
  return normalizeBackendApiBaseUrl(desktopRuntimeConfig.apiBaseUrl || DEFAULT_BACKEND_API_BASE_URL)
}

const BACKEND_API_BASE_URL = resolveBackendApiBaseUrl()

function getDesktopRuntimeConfig(){
  return window.HexaPayDesktop?.runtime || {}
}

function isPackagedDesktopBuild(){
  return Boolean(getDesktopRuntimeConfig().isPackaged)
}

function createBackendConnectivityError(error, options = {}){
  const actionLabel = String(options.actionLabel || "complete the requested action").trim()
  const backendLabel = getDesktopRuntimeConfig().apiBaseUrl || BACKEND_API_BASE_URL
  const originalMessage = String(error?.message || "").trim()
  const message = [
    `Unable to reach the HexaPay backend at ${backendLabel} while trying to ${actionLabel}.`,
    "Check that the backend is running, then try again.",
    originalMessage ? `Details: ${originalMessage}` : ""
  ].filter(Boolean).join(" ")
  const connectivityError = new Error(message)
  connectivityError.status = 0
  connectivityError.backendConnectionError = true
  connectivityError.backendResponse = false
  connectivityError.cause = error
  return connectivityError
}

function isObjectIdLike(value){
  return /^[a-f\d]{24}$/i.test(String(value || "").trim())
}

function normalizeBackendTimeValue(value){
  const trimmedValue = String(value || "").trim()
  if(!trimmedValue){
    return ""
  }

  const timeMatch = trimmedValue.match(/^(\d{2}):(\d{2})(?::\d{2})?$/)
  if(!timeMatch){
    return trimmedValue
  }

  return `${timeMatch[1]}:${timeMatch[2]}`
}

function normalizeAttendanceModeForBackend(mode){
  const normalizedMode = String(mode || "manual").trim().toLowerCase()
  return normalizedMode === "biometric" ? "biometric" : "manual"
}

function getStoreState(){
  return getHexaPayStore().getState()
}

function readPersistedBackendSession(){
  try{
    const rawValue = localStorage.getItem(BACKEND_SESSION_STORAGE_KEY)
    if(!rawValue){
      return null
    }

    const parsedValue = JSON.parse(rawValue)
    return parsedValue && typeof parsedValue === "object"
      ? parsedValue
      : null
  } catch (_error){
    return null
  }
}

function persistBackendSessionSnapshot(session = {}){
  const accessToken = String(session.access_token || "").trim()
  const refreshToken = String(session.refresh_token || "").trim()

  if(!accessToken && !refreshToken){
    localStorage.removeItem(BACKEND_SESSION_STORAGE_KEY)
    return
  }

  localStorage.setItem(BACKEND_SESSION_STORAGE_KEY, JSON.stringify({
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: session.token_type || "Bearer",
    active_company_id: session.active_company_id || getStoreState()?.company?.activeCompanyId || null,
    persisted_at: new Date().toISOString()
  }))
}

function hydratePersistedBackendSession(session = {}){
  const state = getStoreState()
  state.auth.token = session.access_token || null
  state.auth.refreshToken = session.refresh_token || null
  if(session.active_company_id){
    state.company.activeCompanyId = session.active_company_id
  }
  state.auth.status = state.auth.token ? "restoring" : "signed_out"
}

async function refreshBackendAccessToken(){
  if(backendAuthRefreshInFlight){
    return backendAuthRefreshInFlight
  }

  const persistedSession = readPersistedBackendSession()
  const refreshToken = String(
    getStoreState()?.auth?.refreshToken ||
    persistedSession?.refresh_token ||
    ""
  ).trim()

  if(!refreshToken){
    throw new Error("Refresh token is unavailable.")
  }

  backendAuthRefreshInFlight = (async () => {
    let response
    try{
      response = await fetch(`${BACKEND_API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      })
    } catch (error){
      throw createBackendConnectivityError(error, {
        actionLabel: "refresh the current session"
      })
    }
    const payload = await response.json().catch(() => null)

    if(!response.ok){
      const error = new Error(payload?.error?.message || `Backend refresh failed with status ${response.status}.`)
      error.status = response.status
      error.backendResponse = true
      error.payload = payload
      clearBackendSessionFromStore()
      throw error
    }

    return syncBackendSessionToStore({
      ...payload,
      refresh_token: payload?.refresh_token || refreshToken
    })
  })()

  try{
    return await backendAuthRefreshInFlight
  } finally {
    backendAuthRefreshInFlight = null
  }
}

function hasRealBackendSession(){
  const token = getStoreState()?.auth?.token
  return Boolean(token && !String(token).startsWith("mock-token:"))
}

function normalizeBackendRoleLabel(role){
  const normalizedRole = String(role || "").trim().toUpperCase()

  if(normalizedRole === "ADMIN"){
    return "Admin"
  }

  if(normalizedRole === "MANAGER"){
    return "Manager"
  }

  return "Viewer"
}

function normalizeBackendEmploymentType(employmentType){
  return String(employmentType || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Full Time"
}

function normalizeBackendPaymentType(paymentType){
  const normalizedValue = String(paymentType || "").trim().toLowerCase()
  if(normalizedValue === "daily"){
    return "Daily"
  }

  if(normalizedValue === "weekly"){
    return "Weekly"
  }

  return "Monthly"
}

function normalizeBackendEmployeeStatus(status){
  const normalizedStatus = String(status || "").trim().toLowerCase()

  if(normalizedStatus === "active"){
    return "ACTIVE"
  }

  if(normalizedStatus === "on_leave"){
    return "LEAVE"
  }

  if(normalizedStatus === "retired"){
    return "RETIRED"
  }

  if(normalizedStatus === "resigned"){
    return "RESIGNED"
  }

  if(normalizedStatus === "terminated"){
    return "FIRED"
  }

  return String(status || "ACTIVE").toUpperCase()
}

function normalizeFrontendEmployeeStatus(status){
  const normalizedStatus = String(status || "").trim().toUpperCase()

  if(normalizedStatus === "ACTIVE"){
    return "active"
  }

  if(normalizedStatus === "LEAVE"){
    return "on_leave"
  }

  if(normalizedStatus === "RETIRED"){
    return "retired"
  }

  if(normalizedStatus === "RESIGNED"){
    return "resigned"
  }

  if(normalizedStatus === "FIRED"){
    return "terminated"
  }

  return "active"
}

function mapBackendUserToStateUser(user, role){
  if(!user){
    return null
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name || user.displayName || "",
    title: user.title || "",
    role: normalizeBackendRoleLabel(role),
    avatarUrl: user.avatar_url || user.avatarUrl || "",
    status: user.status || "active"
  }
}

function mapBackendCompanyToStateCompany(company){
  if(!company){
    return null
  }

  return {
    id: company.id,
    name: company.name,
    industry: company.industry || "",
    email: company.email || "",
    currency: company.currency_code || company.currencyCode || "KES",
    logoUrl: company.logo_url || company.logoUrl || "Assets/Logo.png"
  }
}

function mapBackendMembershipToStateMembership(membership){
  if(!membership){
    return null
  }

  return {
    id: membership.id,
    companyId: membership.company_id || membership.companyId,
    userId: membership.user_id || membership.userId,
    role: normalizeBackendRoleLabel(membership.role),
    status: membership.status || "active"
  }
}

function mapBackendMembershipResponseToStateMember(membership){
  if(!membership){
    return null
  }

  return {
    id: membership.id,
    userId: membership.user_id || membership.user?.id || "",
    name: membership.user?.display_name || membership.user?.displayName || "Unknown User",
    title: membership.user?.title || "",
    role: normalizeBackendRoleLabel(membership.role),
    email: membership.user?.email || "",
    status: membership.status || "active"
  }
}

function mapBackendEmployeeToStateEmployee(employee){
  if(!employee){
    return null
  }

  const financialProfile = employee.financial_profile || employee.financialProfile || {}
  const loanProfile = financialProfile.loan || {}
  const paymentType = normalizeBackendPaymentType(employee.payment_type || employee.paymentType)
  const paymentBasis = normalizeEmployeePaymentBasis(
    paymentType,
    employee.payment_basis || employee.paymentBasis
  )

  return {
      id: employee.id,
      companyId: employee.company_id || employee.companyId,
      departmentId: employee.department_id || employee.departmentId || "",
      employeeNumber: employee.employee_number || employee.employeeNumber || "",
      fullName: employee.full_name || employee.fullName || "",
      identificationNumber: employee.identification_number || employee.identificationNumber || "",
      accountNumber: employee.account_number || employee.accountNumber || "",
      accountDetails: employee.account_details || employee.accountDetails || "",
      roleTitle: employee.role_title || employee.roleTitle || "",
      employmentType: paymentType,
      paymentType,
      paymentBasis,
      employmentDate: formatBackendDateOnly(employee.employment_date || employee.employmentDate || ""),
      salaryAmount: Number(employee.salary_amount ?? employee.salaryAmount ?? 0),
      status: normalizeBackendEmployeeStatus(employee.status),
      payrollStatus: String(employee.payroll_status || employee.payrollStatus || "pending"),
      profileImage: employee.profile_image_url || employee.profileImage || "",
    unpaidBalance: Number(employee.unpaid_balance || 0),
    documents: Array.isArray(employee.documents) ? employee.documents : [],
    salaryHistory: Array.isArray(employee.salary_history) ? employee.salary_history : [],
    financialProfile: {
      applyTaxFinancials: Boolean(financialProfile.apply_tax_financials ?? financialProfile.applyTaxFinancials),
      statutory: {
        paye: financialProfile.statutory?.paye !== false,
        shif: financialProfile.statutory?.shif !== false && financialProfile.statutory?.insurance !== false,
        nssf: financialProfile.statutory?.nssf !== false && financialProfile.statutory?.pension !== false,
        housingLevy: financialProfile.statutory?.housing_levy !== false && financialProfile.statutory?.housingLevy !== false
      },
      loan: {
        enabled: Boolean(loanProfile.enabled),
        name: loanProfile.name || "",
        principalAmount: Number(loanProfile.principal_amount ?? loanProfile.principalAmount ?? 0),
        balanceAmount: Number(loanProfile.balance_amount ?? loanProfile.balanceAmount ?? 0),
        installmentAmount: Number(loanProfile.installment_amount ?? loanProfile.installmentAmount ?? 0),
        installmentFrequency: loanProfile.installment_frequency || loanProfile.installmentFrequency || "Monthly",
        totalInstallments: Number(loanProfile.total_installments ?? loanProfile.totalInstallments ?? 0),
        installmentsPaid: Number(loanProfile.installments_paid ?? loanProfile.installmentsPaid ?? 0),
        installmentsRemaining: Number(loanProfile.installments_remaining ?? loanProfile.installmentsRemaining ?? Math.max(0, Number(loanProfile.total_installments ?? loanProfile.totalInstallments ?? 0) - Number(loanProfile.installments_paid ?? loanProfile.installmentsPaid ?? 0))),
        sourceChangeId: String(loanProfile.source_change_id || loanProfile.sourceChangeId || "").trim(),
        nextDeductionDate: formatBackendDateOnly(loanProfile.next_deduction_date || loanProfile.nextDeductionDate || "")
      }
    }
  }
}

function withLocalDepartmentFallback(backendEmployee, employeePayload){
  const localDepartmentId = String(employeePayload?.departmentId || "").trim()

  if(!backendEmployee || !localDepartmentId || isObjectIdLike(localDepartmentId)){
    return backendEmployee
  }

  if(backendEmployee.department_id || backendEmployee.departmentId){
    return backendEmployee
  }

  return {
    ...backendEmployee,
    department_id: localDepartmentId
  }
}

function withLocalEmployeePresentationFallback(backendEmployee, employeePayload){
  if(!backendEmployee){
    return backendEmployee
  }

  const localDocuments = Array.isArray(employeePayload?.documents) ? employeePayload.documents.filter(Boolean) : []
  const localProfileImage = String(employeePayload?.profileImage || "").trim()
  const localSalaryHistory = Array.isArray(employeePayload?.salaryHistory) ? employeePayload.salaryHistory : []

  return {
    ...backendEmployee,
    ...(localDocuments.length && !Array.isArray(backendEmployee.documents) ? { documents: localDocuments } : {}),
    ...(localDocuments.length && Array.isArray(backendEmployee.documents) && !backendEmployee.documents.length ? { documents: localDocuments } : {}),
    ...(localProfileImage && !String(backendEmployee.profile_image_url || backendEmployee.profileImage || "").trim() ? { profile_image_url: localProfileImage } : {}),
    ...(localSalaryHistory.length && (!Array.isArray(backendEmployee.salary_history) || !backendEmployee.salary_history.length) ? { salary_history: localSalaryHistory } : {})
  }
}

function withLocalContractPresentationFallback(backendContract, contractPayload){
  if(!backendContract){
    return backendContract
  }

  const localDocuments = Array.isArray(contractPayload?.documents) ? contractPayload.documents.filter(Boolean) : []
  return {
    ...backendContract,
    ...(localDocuments.length ? { documents: localDocuments } : {})
  }
}

function toOptionalBackendLoanPayload(loanProfile){
  const normalizedLoanProfile = loanProfile || {}
  const enabled = Boolean(normalizedLoanProfile.enabled)
  const name = String(normalizedLoanProfile.name || "").trim()
  const principalAmount = Number(normalizedLoanProfile.principalAmount || 0)
  const balanceAmount = Number(normalizedLoanProfile.balanceAmount || 0)
  const installmentAmount = Number(normalizedLoanProfile.installmentAmount || 0)
  const installmentFrequency = String(normalizedLoanProfile.installmentFrequency || "Monthly").trim()
  const totalInstallments = Number(normalizedLoanProfile.totalInstallments || 0)
  const installmentsPaid = Number(normalizedLoanProfile.installmentsPaid || 0)
  const installmentsRemaining = Number(
    normalizedLoanProfile.installmentsRemaining || Math.max(0, totalInstallments - installmentsPaid)
  )
  const sourceChangeId = String(normalizedLoanProfile.sourceChangeId || "").trim()
  const nextDeductionDate = String(normalizedLoanProfile.nextDeductionDate || "").trim()

  const hasMeaningfulLoanData = enabled ||
    Boolean(name) ||
    principalAmount > 0 ||
    balanceAmount > 0 ||
    installmentAmount > 0 ||
    totalInstallments > 0 ||
    installmentsPaid > 0 ||
    installmentsRemaining > 0 ||
    Boolean(sourceChangeId) ||
    Boolean(nextDeductionDate)

  if(!hasMeaningfulLoanData){
    return undefined
  }

  return {
    enabled,
    ...(name ? { name } : {}),
    ...(principalAmount > 0 ? { principal_amount: principalAmount } : {}),
    ...(balanceAmount > 0 ? { balance_amount: balanceAmount } : {}),
    ...(installmentAmount > 0 ? { installment_amount: installmentAmount } : {}),
    ...(installmentFrequency ? { installment_frequency: installmentFrequency } : {}),
    ...(totalInstallments > 0 ? { total_installments: totalInstallments } : {}),
    ...(installmentsPaid > 0 ? { installments_paid: installmentsPaid } : {}),
    ...(installmentsRemaining > 0 ? { installments_remaining: installmentsRemaining } : {}),
    ...(sourceChangeId ? { source_change_id: sourceChangeId } : {}),
    ...(nextDeductionDate ? { next_deduction_date: nextDeductionDate } : {})
  }
}

function normalizeBackendContractStatus(status){
  const normalizedStatus = String(status || "draft").trim().toLowerCase()
  const statusMap = {
    draft: "Draft",
    active: "Active",
    pending: "Pending",
    completed: "Completed",
    terminated: "Terminated",
    resigned: "Resigned"
  }

  return statusMap[normalizedStatus] || "Draft"
}

function normalizeBackendContractType(contractType){
  const normalizedType = String(contractType || "").trim().toLowerCase()
  const typeMap = {
    internship: "Internship",
    temporary: "Temporary",
    freelance: "Freelance",
    permanent: "Permanent"
  }

  return typeMap[normalizedType] || "Internship"
}

function normalizeBackendPayrollSalaryType(salaryType){
  const normalizedValue = String(salaryType || "").trim().toLowerCase()
  if(normalizedValue === "daily"){
    return "Daily"
  }

  if(normalizedValue === "weekly"){
    return "Weekly"
  }

  return "Monthly"
}

function normalizeBackendLeaveStatus(status){
  const normalizedStatus = String(status || "pending").trim().toLowerCase()
  const statusMap = {
    pending: "Pending",
    active: "Active",
    rejected: "Rejected",
    cancelled: "Cancelled",
    completed: "Completed"
  }

  return statusMap[normalizedStatus] || "Pending"
}

function normalizeBackendAttendanceMode(mode){
  const normalizedMode = String(mode || "manual").trim().toLowerCase()
  return normalizedMode === "biometric" ? "HexaScan" : "Manual"
}

function formatBackendDateOnly(value){
  if(!value){
    return ""
  }

  return String(value).slice(0, 10)
}

function mapBackendDepartmentToStateDepartment(department){
  if(!department){
    return null
  }

  return {
    id: department.id,
    companyId: department.company_id,
    name: department.name,
    roles: 0,
    salaryType: normalizeBackendPayrollSalaryType(department.salary_type),
    defaultSalary: Number(department.default_salary_amount ?? 0),
    salary: Number(department.default_salary_amount ?? 0),
    employeeCount: Number(department.employee_count ?? 0),
    headOfDepartmentEmployeeId: department.hod_employee_id || "",
    hod: department.hod_employee?.full_name || "",
    notes: department.notes || "",
    icon: department.icon_key || "fa-building"
  }
}

function mapBackendContractToStateContract(contract){
  if(!contract){
    return null
  }

  const company = getCurrentCompanyFromApiState(getStoreState())
  return {
    id: contract.id,
    companyId: contract.company_id,
    employeeId: contract.employee_id || "",
    partyName: contract.name || contract.employee?.full_name || "Untitled Contract",
    companyName: company?.name || "",
    contractNumber: contract.contract_number || "",
    accountNumber: "",
    accountDetails: "",
    roleTitle: contract.role_title || "",
    contractDate: formatBackendDateOnly(contract.start_date),
    contractType: normalizeBackendContractType(contract.contract_type),
    totalPayment: Number(contract.payment_amount ?? 0),
    status: normalizeBackendContractStatus(contract.status),
    balance: Number(contract.payment_amount ?? 0),
    documents: [],
    paymentHistory: [],
    name: contract.name || contract.employee?.full_name || "Untitled Contract",
    company: company?.name || "",
    role: contract.role_title || "",
    date: formatBackendDateOnly(contract.start_date),
    type: normalizeBackendContractType(contract.contract_type)
  }
}

function mapBackendHolidayToStateHoliday(holiday){
  if(!holiday){
    return null
  }

  return {
    id: holiday.id,
    companyId: holiday.company_id,
    scope: holiday.scope || "company",
    name: holiday.name || "",
    date: formatBackendDateOnly(holiday.date)
  }
}

function mapBackendPayrollRunToStateRun(run){
  if(!run){
    return null
  }

  return {
    id: run.id,
    companyId: run.company_id,
    period: run.period,
    salaryType: normalizeBackendPayrollSalaryType(run.salary_type),
    departmentScope: run.department?.name || "",
    departmentScopeId: run.department_scope_id || "",
    status: run.status,
    approvals: run.approval ? [{
      id: `payroll-approval-${run.id}`,
      approverId: run.approval.approver_user_id || "",
      approverName: "",
      role: "",
      status: run.status === "approved" ? "approved" : run.status === "rejected" ? "rejected" : "pending",
      approvedAt: run.approval.approved_at || null,
      rejectedAt: run.approval.rejected_at || null,
      rejectionReason: run.approval.rejection_reason || ""
    }] : [],
    itemIds: [],
    itemCount: Number(run.item_count ?? 0),
    paidItemCount: Number(run.paid_item_count ?? 0),
    unpaidItemCount: Number(run.unpaid_item_count ?? Math.max(0, Number(run.item_count ?? 0) - Number(run.paid_item_count ?? 0))),
    lastPaidAt: run.last_paid_at || null,
    generatedByUserId: run.generated_by_user_id || "",
    currencyCode: run.currency_code || "KES",
    totals: {
      baseSalary: Number(run.totals?.base_salary ?? 0),
      deductions: Number(run.totals?.deductions ?? 0),
      allowances: Number(run.totals?.allowances ?? 0),
      netPay: Number(run.totals?.net_pay ?? 0)
    },
    generatedAt: run.generated_at || null
  }
}

function mapBackendPayrollItemToStateItem(item, run = null){
  if(!item){
    return null
  }

  const matchedRun = run || getStoreState().payroll.runs.find((entry) => entry.id === item.payroll_run_id)
  return createPayrollItemModel({
    id: item.id,
    runId: item.payroll_run_id,
    companyId: item.company_id,
    employeeId: item.employee_id,
    departmentId: item.department_id || "",
    period: matchedRun?.period || "",
    salaryType: matchedRun?.salaryType || "Monthly",
    attendanceDays: Number(item.attendance_days ?? 0),
    baseSalary: Number(item.base_salary ?? 0),
    grossPay: Number(item.gross_pay ?? item.breakdown?.gross_pay ?? 0),
    taxablePay: Number(item.taxable_pay ?? item.breakdown?.taxable_pay ?? 0),
    payeTaxableBase: Number(item.paye_taxable_base ?? item.breakdown?.paye_taxable_base ?? item.breakdown?.payeTaxableBase ?? item.taxable_pay ?? item.breakdown?.taxable_pay ?? 0),
    deductions: Number(item.deductions_total ?? 0),
    allowances: Number(item.allowances_total ?? 0),
    netPay: Number(item.net_pay ?? 0),
    approvalStatus: item.approval_status || "pending",
    signed: Boolean(item.signed),
    paid: Boolean(item.paid ?? item.signed),
    paidAt: item.paid_at || null,
    paidByUserId: item.paid_by_user_id || "",
    breakdown: structuredClone(item.breakdown || {}),
    allowanceBreakdown: structuredClone(item.allowance_breakdown || []),
    deductionBreakdown: structuredClone(item.deduction_breakdown || []),
    statutoryDeductionsTotal: Number(item.statutory_deductions_total ?? 0),
    structureAllowancesTotal: Number(item.structure_allowances_total ?? 0),
    structureDeductionsTotal: Number(item.structure_deductions_total ?? 0),
    financialRuleAllowancesTotal: Number(item.financial_rule_allowances_total ?? 0),
    financialRuleDeductionsTotal: Number(item.financial_rule_deductions_total ?? 0),
    loanDeductionsTotal: Number(item.loan_deductions_total ?? 0)
  })
}

function mapBackendWorkflowApproval(approval, fallbackKey = "workflow"){
  if(!approval){
    return null
  }

  return {
    id: approval.id || `${fallbackKey}-${approval.approver_id || approval.approver_name || "approval"}`,
    approverId: approval.approver_id || "",
    approverName: approval.approver_name || "",
    role: approval.role || "",
    status: approval.status || "pending",
    approvedAt: approval.approved_at || null,
    rejectedAt: approval.rejected_at || null,
    rejectionReason: approval.rejection_reason || ""
  }
}

function mapBackendPayrollStructureChange(change){
  if(!change){
    return null
  }

  return {
    id: String(change.id || ""),
    kind: change.kind || "",
    type: change.type || "",
    amount: Number(change.amount ?? 0),
    taxable: change.taxable !== false,
    incomeCategory: change.income_category || "allowance",
    salaryType: normalizeBackendPayrollSalaryType(change.salary_type),
    scope: change.scope || "",
    scopeLabel: change.scope_label || change.scope || "",
    targetLabel: change.target_label || "",
    targetEmployeeId: change.target_employee_id || "",
    targetDepartmentId: change.target_department_id || "",
    targetRoleTitle: change.target_role_title || "",
    settlementMode: change.settlement_mode || "",
    settledAt: change.settled_at || null,
    settledRunId: change.settled_run_id || "",
    settledItemId: change.settled_item_id || "",
    settledByUserId: change.settled_by_user_id || "",
    loanDetails: change.loan_details || null,
    createdAt: change.created_at || null,
    requestedByUserId: change.requested_by_user_id || ""
  }
}

function mapBackendPayrollStructureStateToClient(state){
  if(!state){
    return null
  }

  return {
    workflowType: "structure",
    status: state.status || "pending",
    approvals: (state.approvals || []).map((approval, index) =>
      mapBackendWorkflowApproval(approval, `structure-${index}`)
    ).filter(Boolean),
    changes: (state.changes || []).map((change) => mapBackendPayrollStructureChange(change)).filter(Boolean),
    updatedAt: state.updated_at || null
  }
}

function mapBackendPayrollCalendarStateToClient(state){
  if(!state){
    return null
  }

  const monthlySchedule = state.schedules?.monthly || {}
  const weeklySchedule = state.schedules?.weekly || {}

  return {
    workflowType: "calendar",
    salaryType: normalizeBackendPayrollSalaryType(state.salary_type),
    paydayDay: String(state.payday_day || "1"),
    paydayMonth: String(state.payday_month || ""),
    nextPayday: state.next_payday || null,
    schedules: {
      monthly: {
        paydayDay: String(monthlySchedule.payday_day || "1"),
        paydayMonth: String(monthlySchedule.payday_month || ""),
        nextPayday: monthlySchedule.next_payday || null
      },
      weekly: {
        paydayDay: String(weeklySchedule.payday_day || "1"),
        paydayMonth: String(weeklySchedule.payday_month || ""),
        nextPayday: weeklySchedule.next_payday || null
      }
    },
    status: state.status || "pending",
    approvals: (state.approvals || []).map((approval, index) =>
      mapBackendWorkflowApproval(approval, `calendar-${index}`)
    ).filter(Boolean),
    updatedAt: state.updated_at || null
  }
}

function mapBackendAttendanceLogToStateLog(log){
  if(!log){
    return null
  }

  const employee = getStoreState().employees.records.find((record) => record.id === (log.employee_id || log.employee?.id))
  return {
    id: log.id,
    companyId: log.company_id,
    employeeId: log.employee_id,
    employeeName: log.employee?.full_name || employee?.fullName || "",
    departmentId: employee?.departmentId || "",
    departmentName: employee ? (getStoreState().company.departments.find((department) => department.id === employee.departmentId)?.name || "Unassigned") : "Unassigned",
    roleTitle: log.employee?.role_title || employee?.roleTitle || "",
    date: formatBackendDateOnly(log.date),
    checkIn: log.check_in || "",
    checkOut: log.check_out || "",
    mode: normalizeBackendAttendanceMode(log.mode),
    approvals: [{
      id: `attendance-approval-${log.id}`,
      approverId: log.approval?.approver_user_id || "",
      approverName: "",
      role: "",
      status: log.approval_status === "approved" ? "approved" : log.approval_status === "rejected" ? "rejected" : "pending",
      approvedAt: log.approval?.approved_at || null,
      rejectedAt: log.approval?.rejected_at || null,
      rejectionReason: log.approval?.rejection_reason || ""
    }],
    employee: log.employee?.full_name || employee?.fullName || "",
    department: employee ? (getStoreState().company.departments.find((department) => department.id === employee.departmentId)?.name || "Unassigned") : "Unassigned",
    role: log.employee?.role_title || employee?.roleTitle || ""
  }
}

function mapBackendLeaveRequestToStateRequest(request){
  if(!request){
    return null
  }

  const employee = getStoreState().employees.records.find((record) => record.id === (request.employee_id || request.employee?.id))
  return {
    id: request.id,
    companyId: request.company_id,
    employeeId: request.employee_id,
    employeeName: request.employee?.full_name || employee?.fullName || "",
    leaveType: request.leave_type || "",
    departmentId: employee?.departmentId || "",
    departmentName: employee ? (getStoreState().company.departments.find((department) => department.id === employee.departmentId)?.name || "Unassigned") : "Unassigned",
    fromDate: formatBackendDateOnly(request.from_date),
    toDate: formatBackendDateOnly(request.to_date),
    requestedDate: formatBackendDateOnly(request.requested_date),
    status: normalizeBackendLeaveStatus(request.status),
    approvals: [{
      id: `leave-approval-${request.id}`,
      approverId: request.approval?.approver_user_id || "",
      approverName: "",
      role: "",
      status: String(request.status || "").toLowerCase() === "active" ? "approved" : String(request.status || "").toLowerCase() === "rejected" ? "rejected" : "pending",
      approvedAt: request.approval?.approved_at || null,
      rejectedAt: request.approval?.rejected_at || null,
      rejectionReason: request.approval?.rejection_reason || ""
    }],
    employee: request.employee?.full_name || employee?.fullName || "",
    type: request.leave_type || "",
    department: employee ? (getStoreState().company.departments.find((department) => department.id === employee.departmentId)?.name || "Unassigned") : "Unassigned",
    from: formatBackendDateOnly(request.from_date),
    to: formatBackendDateOnly(request.to_date),
    requested: formatBackendDateOnly(request.requested_date)
  }
}

function upsertById(collection, record){
  const existingIndex = collection.findIndex((item) => item.id === record.id)
  if(existingIndex >= 0){
    collection[existingIndex] = record
  } else {
    collection.push(record)
  }
}

function syncBackendSessionToStore(session){
  const state = getStoreState()
  const currentUser = mapBackendUserToStateUser(
    session.user,
    session.active_membership?.role || session.memberships?.[0]?.role
  )

  if(currentUser){
    upsertById(state.auth.users, currentUser)
    state.auth.currentUserId = currentUser.id
    state.auth.currentUser = currentUser
  } else {
    state.auth.currentUserId = null
    state.auth.currentUser = null
  }

  state.auth.token = session.access_token || null
  state.auth.refreshToken = session.refresh_token || state.auth.refreshToken || null
  state.auth.status = currentUser ? "signed_in" : "signed_out"

  const sessionCompanyIds = new Set(
    (session.memberships || [])
      .map((membership) => membership?.company?.id || membership?.company_id || membership?.companyId)
      .filter(Boolean)
      .map((companyId) => String(companyId))
  )

  if(session.active_company_id){
    sessionCompanyIds.add(String(session.active_company_id))
  }

  ;(session.memberships || []).forEach((membership) => {
    const company = mapBackendCompanyToStateCompany(membership.company || null)
    const normalizedMembership = mapBackendMembershipToStateMembership(membership)

    if(company){
      upsertById(state.company.companies, company)
    }

    if(normalizedMembership){
      upsertById(state.company.memberships, normalizedMembership)
    }
  })

  if(session.active_company){
    const activeCompany = mapBackendCompanyToStateCompany(session.active_company)
    upsertById(state.company.companies, activeCompany)
  }

  if(session.active_company_id){
    state.company.activeCompanyId = session.active_company_id
  }

  if((session.memberships || []).length || session.active_company){
    state.company.companies = state.company.companies.filter((company) =>
      (company.id !== "local-company" || Boolean(company.name || company.email)) &&
      (!sessionCompanyIds.size || sessionCompanyIds.has(String(company.id)))
    )
    state.company.memberships = state.company.memberships.filter((membership) => membership.companyId !== "local-company")
    if(sessionCompanyIds.size){
      state.company.memberships = state.company.memberships.filter((membership) =>
        sessionCompanyIds.has(String(membership.companyId))
      )
    }
  }

  persistBackendSessionSnapshot({
    access_token: state.auth.token,
    refresh_token: state.auth.refreshToken,
    token_type: session.token_type || "Bearer",
    active_company_id: state.company.activeCompanyId || session.active_company_id || null
  })

  return {
    token: session.access_token || null,
    refreshToken: state.auth.refreshToken || null,
    tokenType: session.token_type || "Bearer",
    currentUser,
    expiresIn: session.expires_in || 3600,
    memberships: session.memberships || [],
    activeCompanyId: session.active_company_id || null
  }
}

function clearBackendSessionFromStore(){
  const state = getStoreState()
  const previousUser = state.auth.currentUser

  state.auth.currentUserId = null
  state.auth.currentUser = null
  state.auth.token = null
  state.auth.refreshToken = null
  state.auth.status = "signed_out"
  localStorage.removeItem(BACKEND_SESSION_STORAGE_KEY)

  return previousUser
}

function replaceCompanyEmployeesInStore(companyId, backendEmployees){
  const state = getStoreState()
  const mappedEmployees = backendEmployees.map((employee) => mapBackendEmployeeToStateEmployee(employee)).filter(Boolean)

  state.employees.records = state.employees.records
    .filter((employee) => employee.companyId !== companyId)
    .concat(mappedEmployees)

  return mappedEmployees
}

function upsertBackendEmployeeInStore(backendEmployee){
  const state = getStoreState()
  const mappedEmployee = mapBackendEmployeeToStateEmployee(backendEmployee)
  upsertById(state.employees.records, mappedEmployee)
  return mappedEmployee
}

function removeBackendEmployeeFromStore(employeeId){
  const state = getStoreState()
  const employeeIndex = state.employees.records.findIndex((employee) => employee.id === employeeId)
  if(employeeIndex < 0){
    return null
  }

  const [deletedEmployee] = state.employees.records.splice(employeeIndex, 1)
  return deletedEmployee
}

function replaceCompanyDataCollectionInStore(collectionPath, companyId, records){
  const state = getStoreState()
  const mappedCollection = collectionPath.reduce((target, key) => target[key], state)
  const nextRecords = mappedCollection
    .filter((record) => record.companyId !== companyId)
    .concat(records)

  const parent = collectionPath.slice(0, -1).reduce((target, key) => target[key], state)
  parent[collectionPath.at(-1)] = nextRecords
  return records
}

function upsertBackendCompanyInStore(company){
  const state = getStoreState()
  const mappedCompany = mapBackendCompanyToStateCompany(company)
  upsertById(state.company.companies, mappedCompany)
  if(state.company.activeCompanyId === mappedCompany.id){
    state.company.profile = {
      ...state.company.profile,
      name: mappedCompany.name,
      industry: mappedCompany.industry,
      email: mappedCompany.email,
      currency: mappedCompany.currency
    }
  }
  return mappedCompany
}

function replaceBackendMembershipsInStore(companyId, memberships){
  const state = getStoreState()
  const normalizedMemberships = []

  memberships.forEach((membership) => {
    const normalizedMembership = mapBackendMembershipToStateMembership(membership)
    const backendUser = membership.user
      ? mapBackendUserToStateUser(membership.user, membership.role)
      : null

    if(backendUser){
      upsertById(state.auth.users, backendUser)
    }

    if(normalizedMembership){
      normalizedMemberships.push(normalizedMembership)
    }
  })

  state.company.memberships = state.company.memberships
    .filter((membership) => membership.companyId !== companyId)
    .concat(normalizedMemberships)

  return memberships.map((membership) => mapBackendMembershipResponseToStateMember(membership)).filter(Boolean)
}

function applyBackendMembershipUpdateToStore(companyId, membership){
  const state = getStoreState()
  const normalizedMembership = mapBackendMembershipToStateMembership(membership)
  const backendUser = membership?.user
    ? mapBackendUserToStateUser(membership.user, membership.role)
    : null

  if(backendUser){
    upsertById(state.auth.users, backendUser)
  }

  if(normalizedMembership){
    upsertById(state.company.memberships, normalizedMembership)
  }

  if(normalizedMembership){
    const existingUser = state.auth.users.find((user) => String(user.id || "") === String(normalizedMembership.userId || ""))
    if(existingUser){
      existingUser.role = normalizedMembership.role
    }

    if(String(state.auth.currentUserId || "") === String(normalizedMembership.userId || "")){
      state.auth.currentUser = {
        ...(state.auth.currentUser || existingUser || {}),
        role: normalizedMembership.role
      }
    }
  }

  if(backendUser && String(state.auth.currentUserId || "") === String(backendUser.id || "")){
    state.auth.currentUserId = backendUser.id
    state.auth.currentUser = {
      ...(state.auth.currentUser || {}),
      ...backendUser
    }
  }

  return mapBackendMembershipResponseToStateMember(membership)
}

function replaceBackendDepartmentsInStore(companyId, departments){
  const mapped = departments.map((department) => mapBackendDepartmentToStateDepartment(department)).filter(Boolean)
  return replaceCompanyDataCollectionInStore(["company", "departments"], companyId, mapped)
}

function replaceBackendContractsInStore(companyId, contracts){
  const mapped = contracts.map((contract) => mapBackendContractToStateContract(contract)).filter(Boolean)
  return replaceCompanyDataCollectionInStore(["contracts", "records"], companyId, mapped)
}

function replaceBackendHolidaysInStore(companyId, holidays){
  const mappedHolidays = holidays.map((holiday) => mapBackendHolidayToStateHoliday(holiday)).filter(Boolean)
  const companyHolidays = mappedHolidays.filter((holiday) => holiday.scope === "company")
  const nationalHolidays = mappedHolidays.filter((holiday) => holiday.scope === "national")
  replaceCompanyDataCollectionInStore(["holidays", "companyRecords"], companyId, companyHolidays)
  replaceCompanyDataCollectionInStore(["holidays", "nationalRecords"], companyId, nationalHolidays)
  return mappedHolidays
}

function upsertBackendHolidayInStore(holiday){
  const state = getStoreState()
  const mappedHoliday = mapBackendHolidayToStateHoliday(holiday)
  if(!mappedHoliday){
    return null
  }

  const targetCollection = mappedHoliday.scope === "national"
    ? state.holidays.nationalRecords
    : state.holidays.companyRecords
  const otherCollection = mappedHoliday.scope === "national"
    ? state.holidays.companyRecords
    : state.holidays.nationalRecords

  const otherIndex = otherCollection.findIndex((record) => String(record.id) === String(mappedHoliday.id))
  if(otherIndex >= 0){
    otherCollection.splice(otherIndex, 1)
  }

  upsertById(targetCollection, mappedHoliday)
  return mappedHoliday
}

function removeBackendHolidayFromStore(holidayId){
  const state = getStoreState()
  const companyIndex = state.holidays.companyRecords.findIndex((holiday) => String(holiday.id) === String(holidayId))
  if(companyIndex >= 0){
    return state.holidays.companyRecords.splice(companyIndex, 1)[0]
  }

  const nationalIndex = state.holidays.nationalRecords.findIndex((holiday) => String(holiday.id) === String(holidayId))
  if(nationalIndex >= 0){
    return state.holidays.nationalRecords.splice(nationalIndex, 1)[0]
  }

  return null
}

function replaceBackendPayrollRunsInStore(companyId, runs){
  const mapped = runs.map((run) => mapBackendPayrollRunToStateRun(run)).filter(Boolean)
  const records = replaceCompanyDataCollectionInStore(["payroll", "runs"], companyId, mapped)
  syncStoreApprovalTemplates()
  return records
}

function buildPayrollRunSummaryFromItems(run){
  const runItems = getStoreState().payroll.items.filter((item) => item.runId === run.id)
  const paidItemCount = runItems.filter((item) => item.paid || item.signed).length
  const lastPaidAt = runItems
    .map((item) => item.paidAt || null)
    .filter(Boolean)
    .sort()
    .at(-1) || null
  const unpaidItemCount = Math.max(0, runItems.length - paidItemCount)
  const nextStatus = runItems.length > 0 && unpaidItemCount === 0
    ? "posted"
    : (run.status === "posted" ? "approved" : run.status)

  return {
    ...run,
    itemCount: runItems.length,
    paidItemCount,
    unpaidItemCount,
    lastPaidAt
    ,
    status: nextStatus
  }
}

function upsertBackendPayrollRunInStore(run){
  const state = getStoreState()
  const mappedRun = mapBackendPayrollRunToStateRun(run)
  upsertById(state.payroll.runs, mappedRun)
  syncStoreApprovalTemplates()
  return state.payroll.runs.find((entry) => entry.id === mappedRun.id) || mappedRun
}

function replaceBackendPayrollItemsForRunInStore(runId, items, run = null){
  const state = getStoreState()
  const mappedItems = items.map((item) => mapBackendPayrollItemToStateItem(item, run)).filter(Boolean)
  state.payroll.items = state.payroll.items
    .filter((item) => item.runId !== runId)
    .concat(mappedItems)
  return mappedItems
}

function upsertBackendAttendanceLogInStore(log){
  const state = getStoreState()
  const mappedLog = mapBackendAttendanceLogToStateLog(log)
  upsertById(state.attendance.records, mappedLog)
  syncStoreApprovalTemplates()
  return state.attendance.records.find((entry) => entry.id === mappedLog.id) || mappedLog
}

function upsertBackendLeaveRequestInStore(request){
  const state = getStoreState()
  const mappedRequest = mapBackendLeaveRequestToStateRequest(request)
  upsertById(state.leave.records, mappedRequest)
  syncStoreApprovalTemplates()
  return state.leave.records.find((entry) => entry.id === mappedRequest.id) || mappedRequest
}

function getSelectedDepartmentScopeId(state, selectedDepartmentValue = state.payroll.workspace.department){
  const normalizedSelection = String(selectedDepartmentValue || "").trim()
  if(!normalizedSelection){
    return null
  }

  return state.company.departments.find((department) =>
    String(department.id || "") === normalizedSelection
  )?.id || null
}

function getSelectedDepartmentScopeIdFromSelection(state, selection){
  const selectedDepartmentValue = selection?.departmentScope ?? state.payroll.workspace.department
  if(!selectedDepartmentValue){
    return null
  }

  return getSelectedDepartmentScopeId(state, selectedDepartmentValue)
}

async function getBackendPayrollRunPayload(runId){
  const companyId = getActiveBackendCompanyId()
  const [runPayload, itemsPayload] = await Promise.all([
    requestBackend(`/companies/${companyId}/payroll-runs/${runId}`),
    requestBackend(`/companies/${companyId}/payroll-runs/${runId}/items`)
  ])

  const run = upsertBackendPayrollRunInStore(runPayload.payroll_run)
  const items = replaceBackendPayrollItemsForRunInStore(runId, itemsPayload.payroll_items || [], run)

  return {
    run,
    items
  }
}

function replaceBackendAttendanceLogsInStore(companyId, logs){
  const mapped = logs.map((log) => mapBackendAttendanceLogToStateLog(log)).filter(Boolean)
  return replaceCompanyDataCollectionInStore(["attendance", "records"], companyId, mapped)
}

function replaceBackendLeaveRequestsInStore(companyId, requests){
  const mapped = requests.map((request) => mapBackendLeaveRequestToStateRequest(request)).filter(Boolean)
  return replaceCompanyDataCollectionInStore(["leave", "records"], companyId, mapped)
}

function payrollItemHasStatutoryPrePayeDeductions(item){
  const deductionBreakdown = Array.isArray(item?.deductionBreakdown) ? item.deductionBreakdown : []
  return deductionBreakdown.some((entry) =>
    ["statutory_shif", "statutory_nssf", "statutory_housing_levy"].includes(String(entry?.sourceType || "").trim().toLowerCase()) &&
    Number(entry?.amount || 0) > 0
  )
}

function isPayrollItemUsingStalePayeStructure(item){
  const taxablePay = Number(item?.taxablePay || 0)
  const payeTaxableBase = Number(item?.breakdown?.paye_taxable_base ?? item?.breakdown?.payeTaxableBase ?? item?.payeTaxableBase ?? taxablePay)

  if(!payrollItemHasStatutoryPrePayeDeductions(item)){
    return false
  }

  return !Number.isFinite(payeTaxableBase) || payeTaxableBase >= taxablePay
}

function isPayrollPayloadUsingStalePayeStructure(payload){
  return Array.isArray(payload?.items) && payload.items.some(isPayrollItemUsingStalePayeStructure)
}

async function requestBackend(path, options = {}){
  const { requiresAuth = true, _hasRetried = false, actionLabel = "complete the requested action", ...fetchOptions } = options
  const headers = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {})
  }
  const token = getStoreState()?.auth?.token

  if(requiresAuth && token){
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try{
    response = await fetch(`${BACKEND_API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers
    })
  } catch (error){
    throw createBackendConnectivityError(error, {
      actionLabel
    })
  }
  const payload = await response.json().catch(() => null)

  if(response.status === 401 && requiresAuth && !_hasRetried){
    await refreshBackendAccessToken()
    return requestBackend(path, {
      ...options,
      _hasRetried: true
    })
  }

  if(!response.ok){
    const errorMessage = payload?.error?.message ||
      payload?.message ||
      payload?.errors?.[0]?.message ||
      `Backend request failed with status ${response.status}.`
    const error = new Error(errorMessage)
    error.status = response.status
    error.backendResponse = true
    error.payload = payload
    throw error
  }

  return payload
}

async function requestBackendFile(path, options = {}){
  const { requiresAuth = true, _hasRetried = false, actionLabel = "download the requested file", ...fetchOptions } = options
  const headers = {
    ...(fetchOptions.headers || {})
  }
  const token = getStoreState()?.auth?.token

  if(requiresAuth && token){
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try{
    response = await fetch(`${BACKEND_API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers
    })
  } catch (error){
    throw createBackendConnectivityError(error, {
      actionLabel
    })
  }

  if(response.status === 401 && requiresAuth && !_hasRetried){
    await refreshBackendAccessToken()
    return requestBackendFile(path, {
      ...options,
      _hasRetried: true
    })
  }

  if(!response.ok){
    const payload = await response.json().catch(() => null)
    const error = new Error(payload?.error?.message || `Backend file request failed with status ${response.status}.`)
    error.status = response.status
    error.backendResponse = true
    error.payload = payload
    throw error
  }

  const disposition = response.headers.get("content-disposition") || ""
  const fileNameMatch = disposition.match(/filename="?([^"]+)"?/i)
  const fileName = fileNameMatch?.[1] || "download.dat"
  const mimeType = response.headers.get("content-type") || "application/octet-stream"
  const blob = await response.blob()

  return {
    blob,
    fileName,
    mimeType
  }
}

function triggerBrowserDownload({ blob, fileName }){
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = objectUrl
  link.download = fileName || "download.dat"
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl)
  }, 0)
}

function shouldFallbackToMock(error, options = {}){
  const operation = options.operation || "read"
  if(error?.backendResponse || error?.backendConnectionError){
    return false
  }

  if(!canUseDevelopmentMockApi()){
    return false
  }

  return operation === "read"
}

function getActiveBackendCompanyId(){
  return getStoreState()?.company?.activeCompanyId || getCurrentCompanyFromApiState(getStoreState())?.id || null
}

function toBackendEmployeePayload(employeePayload){
  const financialProfile = employeePayload?.financialProfile || {}
  const normalizedDepartmentId = isObjectIdLike(employeePayload?.departmentId)
    ? String(employeePayload.departmentId).trim()
    : null
  const employeeNumber = String(employeePayload.employeeNumber || "").trim()
  const identificationNumber = String(employeePayload.identificationNumber || "").trim()
  const accountNumber = String(employeePayload.accountNumber || "").trim()
  const accountDetails = String(employeePayload.accountDetails || "").trim()
  const profileImageUrl = String(employeePayload.profileImage || "").trim()

  const paymentType = String(employeePayload.paymentType || employeePayload.employmentType || "Monthly").trim().toLowerCase()
  const paymentBasis = normalizeEmployeePaymentBasis(paymentType, employeePayload.paymentBasis)

  return {
    ...(normalizedDepartmentId ? { department_id: normalizedDepartmentId } : {}),
    ...(employeeNumber ? { employee_number: employeeNumber } : {}),
    full_name: employeePayload.fullName,
    ...(identificationNumber ? { identification_number: identificationNumber } : {}),
    ...(accountNumber ? { account_number: accountNumber } : {}),
    ...(accountDetails ? { account_details: accountDetails } : {}),
    role_title: employeePayload.roleTitle,
    employment_type: "full_time",
    payment_type: paymentType,
    payment_basis: paymentBasis,
    employment_date: employeePayload.employmentDate,
    salary_amount: Number(employeePayload.salaryAmount || 0),
    salary_currency: getCurrentCompanyFromApiState(getStoreState())?.currency || "KES",
    status: normalizeFrontendEmployeeStatus(employeePayload.status),
    payroll_status: employeePayload.payrollStatus || "pending",
    ...(profileImageUrl ? { profile_image_url: profileImageUrl } : {}),
    financial_profile: toBackendFinancialProfilePayload(financialProfile)
  }
}

function mergeEmployeeFinancialProfile(baseProfile = {}, overrides = {}){
  const baseStatutory = baseProfile?.statutory || {}
  const overrideStatutory = overrides?.statutory || {}
  const baseLoan = baseProfile?.loan || {}
  const overrideLoan = overrides?.loan || {}

  return {
    ...structuredClone(baseProfile || {}),
    ...structuredClone(overrides || {}),
    statutory: {
      ...structuredClone(baseStatutory),
      ...structuredClone(overrideStatutory)
    },
    loan: {
      ...structuredClone(baseLoan),
      ...structuredClone(overrideLoan)
    }
  }
}

function toBackendFinancialProfilePayload(financialProfile = {}){
  const backendLoanPayload = toOptionalBackendLoanPayload(financialProfile.loan || {})

  return {
    apply_tax_financials: Boolean(financialProfile.applyTaxFinancials),
    statutory: {
      paye: financialProfile.statutory?.paye !== false,
      shif: financialProfile.statutory?.shif !== false,
      nssf: financialProfile.statutory?.nssf !== false,
      housing_levy: financialProfile.statutory?.housingLevy !== false
    },
    ...(backendLoanPayload ? { loan: backendLoanPayload } : {})
  }
}

function toBackendEmployeeUpdatePayload(existingEmployee, updates){
  const payload = {}
  const mergedEmployee = {
    ...structuredClone(existingEmployee || {}),
    ...structuredClone(updates || {})
  }
  const assignOptionalTrimmedString = (fieldName, payloadKey) => {
    if(!Object.prototype.hasOwnProperty.call(updates, fieldName)){
      return
    }

    const nextValue = String(mergedEmployee[fieldName] || "").trim()
    if(nextValue){
      payload[payloadKey] = nextValue
    }
  }

  if(Object.prototype.hasOwnProperty.call(updates, "departmentId")){
    payload.department_id = isObjectIdLike(updates?.departmentId)
      ? String(updates.departmentId).trim()
      : null
  }
  if(Object.prototype.hasOwnProperty.call(updates, "employeeNumber")){
    const employeeNumber = String(mergedEmployee.employeeNumber || "").trim()
    payload.employee_number = employeeNumber || ""
  }
  if(Object.prototype.hasOwnProperty.call(updates, "fullName")){
    payload.full_name = mergedEmployee.fullName
  }
  assignOptionalTrimmedString("identificationNumber", "identification_number")
  assignOptionalTrimmedString("accountNumber", "account_number")
  assignOptionalTrimmedString("accountDetails", "account_details")
  assignOptionalTrimmedString("roleTitle", "role_title")
  if(Object.prototype.hasOwnProperty.call(updates, "employmentType")){
    payload.employment_type = String(mergedEmployee.employmentType || "").trim().toLowerCase().replace(/\s+/g, "_")
  }
  if(Object.prototype.hasOwnProperty.call(updates, "paymentType") || Object.prototype.hasOwnProperty.call(updates, "employmentType")){
    payload.payment_type = String(mergedEmployee.paymentType || mergedEmployee.employmentType || "Monthly").trim().toLowerCase()
  }
  if(
    Object.prototype.hasOwnProperty.call(updates, "paymentBasis") ||
    Object.prototype.hasOwnProperty.call(updates, "paymentType") ||
    Object.prototype.hasOwnProperty.call(updates, "employmentType")
  ){
    payload.payment_basis = normalizeEmployeePaymentBasis(
      mergedEmployee.paymentType || mergedEmployee.employmentType || "Monthly",
      mergedEmployee.paymentBasis
    )
  }
  if(Object.prototype.hasOwnProperty.call(updates, "employmentDate")){
    payload.employment_date = mergedEmployee.employmentDate
  }
  if(Object.prototype.hasOwnProperty.call(updates, "salaryAmount")){
    payload.salary_amount = Number(mergedEmployee.salaryAmount || 0)
    payload.salary_currency = getCurrentCompanyFromApiState(getStoreState())?.currency || "KES"
  }
  if(Object.prototype.hasOwnProperty.call(updates, "status")){
    payload.status = normalizeFrontendEmployeeStatus(mergedEmployee.status)
  }
  if(Object.prototype.hasOwnProperty.call(updates, "payrollStatus")){
    payload.payroll_status = mergedEmployee.payrollStatus || "pending"
  }
  assignOptionalTrimmedString("profileImage", "profile_image_url")
  if(Object.prototype.hasOwnProperty.call(updates, "financialProfile")){
    payload.financial_profile = toBackendFinancialProfilePayload(
      mergeEmployeeFinancialProfile(existingEmployee?.financialProfile, updates?.financialProfile)
    )
  }

  return payload
}

function toBackendDepartmentPayload(departmentPayload){
  const name = String(departmentPayload?.name || "").trim()
  const salaryType = String(departmentPayload?.salaryType || "").trim().toLowerCase()
  const notes = String(departmentPayload?.notes || "").trim()
  const iconKey = String(departmentPayload?.icon || departmentPayload?.iconKey || "").trim()
  const hodEmployeeId = String(
    departmentPayload?.headOfDepartmentEmployeeId || departmentPayload?.hodEmployeeId || ""
  ).trim()

  return {
    ...(name ? { name } : {}),
    ...(salaryType ? { salary_type: salaryType } : {}),
    ...(Number.isFinite(Number(departmentPayload?.defaultSalary ?? departmentPayload?.salary ?? null))
      ? { default_salary_amount: Number(departmentPayload?.defaultSalary ?? departmentPayload?.salary ?? 0) }
      : {}),
    ...(notes ? { notes } : {}),
    ...(iconKey ? { icon_key: iconKey } : {}),
    ...(isObjectIdLike(hodEmployeeId) ? { hod_employee_id: hodEmployeeId } : {})
  }
}

function normalizeStateContractTypeForBackend(contractType){
  return String(contractType || "").trim().toLowerCase()
}

function normalizeStateContractStatusForBackend(status){
  return String(status || "draft").trim().toLowerCase()
}

function normalizeStateLeaveTypeForBackend(leaveType){
  return String(leaveType || "")
    .trim()
    .toLowerCase()
    .replace(/\s+leave$/i, "")
    .replace(/\s+/g, "_")
}

function toBackendContractPayload(contractPayload){
  const payload = {}
  const company = getCurrentCompanyFromApiState(getStoreState())
  const employeeId = String(contractPayload?.employeeId || "").trim()
  const contractType = normalizeStateContractTypeForBackend(contractPayload?.contractType)
  const contractStatus = normalizeStateContractStatusForBackend(contractPayload?.status || "active")
  const paymentAmount = Number(contractPayload?.totalPayment || 0)
  const startDate = String(contractPayload?.contractDate || "").trim()
  const endDate = String(contractPayload?.endDate || "").trim()

  if(employeeId && isObjectIdLike(employeeId)){
    payload.employee_id = employeeId
  }
  if(contractPayload?.contractNumber !== undefined){
    payload.contract_number = String(contractPayload.contractNumber || "").trim()
  }
  if(contractPayload?.partyName !== undefined || contractPayload?.name !== undefined){
    payload.name = String(contractPayload.partyName || contractPayload.name || "").trim()
  }
  if(contractPayload?.roleTitle !== undefined || contractPayload?.role !== undefined){
    payload.role_title = String(contractPayload.roleTitle || contractPayload.role || "").trim()
  }
  if(contractType){
    payload.contract_type = contractType
  }
  if(startDate){
    payload.start_date = startDate
  }
  if(endDate){
    payload.end_date = endDate
  }
  if(Number.isFinite(paymentAmount)){
    payload.payment_amount = paymentAmount
  }
  payload.currency_code = String(contractPayload?.currencyCode || company?.currency || "KES").trim().toUpperCase()
  if(contractStatus){
    payload.status = contractStatus
  }
  if(contractPayload?.notes !== undefined){
    payload.notes = String(contractPayload.notes || "").trim()
  }

  return payload
}

function toBackendHolidayPayload(holidayPayload){
  const payload = {}
  const scope = String(holidayPayload?.scope || "company").trim().toLowerCase()
  const name = String(holidayPayload?.name || "").trim()
  const date = String(holidayPayload?.date || "").trim()
  const countryCode = String(holidayPayload?.countryCode || "").trim().toUpperCase()
  const status = String(holidayPayload?.status || "").trim().toLowerCase()

  if(scope){
    payload.scope = scope
  }
  if(name){
    payload.name = name
  }
  if(date){
    payload.date = date
  }
  if(countryCode){
    payload.country_code = countryCode
  }
  if(status){
    payload.status = status
  }

  return payload
}

window.HexaPayApi = {
  async register(payload){
    const companyPayload = payload?.company || {}

    try{
      const session = await requestBackend("/auth/register", {
        method: "POST",
        requiresAuth: false,
        actionLabel: "create your company account",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          display_name: payload.displayName,
          company: {
            name: companyPayload.name,
            industry: companyPayload.industry || "Business Services",
            currency_code: companyPayload.currencyCode || "KES",
            country_code: companyPayload.countryCode || "KE",
            timezone: companyPayload.timezone || "Africa/Nairobi",
            logo_url: companyPayload.logoUrl || ""
          }
        })
      })

      return structuredClone(syncBackendSessionToStore(session))
    } catch (error){
      if(!shouldFallbackToMock(error, { operation: "auth" })){
        throw error
      }

      throw error
    }
  },
  async login(email, password, options = {}){
    try{
      const session = await requestBackend("/auth/login", {
        method: "POST",
        requiresAuth: false,
        actionLabel: "sign in",
        body: JSON.stringify({
          email,
          password,
          ...(isObjectIdLike(options.companyId) ? { companyId: options.companyId } : {})
        })
      })

      return structuredClone(syncBackendSessionToStore(session))
    } catch (error){
      if(!shouldFallbackToMock(error, { operation: "auth" })){
        throw error
      }

      await waitForMockApi()
      const store = getHexaPayStore()
      const session = store.login(email, password)
      return structuredClone(session)
    }
  },

  async logout(){
    if(hasRealBackendSession()){
      try{
        await requestBackend("/auth/logout", {
          method: "POST",
          body: JSON.stringify({})
        })
      } finally {
        const previousUser = clearBackendSessionFromStore()
        return structuredClone({
          success: true,
          previousUser
        })
      }
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const previousUser = store.logout()
    return structuredClone({
      success: true,
      previousUser
    })
  },

  async restorePersistedSession(){
    const persistedSession = readPersistedBackendSession()
    if(!persistedSession){
      return null
    }

    hydratePersistedBackendSession(persistedSession)

    try{
      const currentUser = await this.getCurrentUser()
      await this.getCompany().catch(() => null)
      await this.getMemberships().catch(() => null)
      return structuredClone({
        currentUser,
        activeCompanyId: getStoreState()?.company?.activeCompanyId || persistedSession.active_company_id || null
      })
    } catch (error){
      if(error?.status !== 401){
        clearBackendSessionFromStore()
        return null
      }
    }

    try{
      await refreshBackendAccessToken()
      const currentUser = await this.getCurrentUser()
      await this.getCompany().catch(() => null)
      await this.getMemberships().catch(() => null)
      return structuredClone({
        currentUser,
        activeCompanyId: getStoreState()?.company?.activeCompanyId || persistedSession.active_company_id || null
      })
    } catch (_error){
      clearBackendSessionFromStore()
      return null
    }
  },

  async getCurrentUser(){
    if(hasRealBackendSession()){
      try{
        const session = await requestBackend("/auth/me", {
          actionLabel: "load your account"
        })
        return structuredClone(syncBackendSessionToStore({
          access_token: getStoreState().auth.token,
          token_type: "Bearer",
          expires_in: 3600,
          ...session
        }).currentUser)
      } catch (error){
        if(!shouldFallbackToMock(error, { operation: "auth" })){
          throw error
        }
      }
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    return structuredClone(store.getCurrentUser())
  },

  async saveCurrentUserProfile(payload = {}){
    const state = getStoreState()
    const currentUser = state.auth.currentUser

    if(hasRealBackendSession()){
      const response = await requestBackend("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(payload)
      })

      const updatedUser = mapBackendUserToStateUser(
        response.user,
        currentUser?.role || state.company.currentMembership?.role || "Member"
      )

      if(updatedUser){
        upsertById(state.auth.users, updatedUser)
        state.auth.currentUserId = updatedUser.id
        state.auth.currentUser = updatedUser
      }

      return structuredClone(updatedUser)
    }

    if(!currentUser){
      throw new Error("No signed-in user was found.")
    }

    if(payload.display_name !== undefined){
      currentUser.displayName = String(payload.display_name || "").trim()
    }

    if(payload.avatar_url !== undefined){
      currentUser.avatarUrl = String(payload.avatar_url || "").trim()
    }

    upsertById(state.auth.users, currentUser)
    state.auth.currentUser = currentUser
    return structuredClone(currentUser)
  },

  async switchCompany(companyId){
    if(hasRealBackendSession()){
      const session = await requestBackend("/auth/switch-company", {
        method: "POST",
        body: JSON.stringify({ companyId })
      })

      return structuredClone(syncBackendSessionToStore(session))
    }

    await waitForMockApi()
    const state = getStoreState()
    const company = state.company.companies.find((item) => String(item.id) === String(companyId))
    if(!company){
      throw new Error("Company was not found.")
    }

    state.company.activeCompanyId = company.id
    return structuredClone({
      activeCompanyId: company.id,
      company
    })
  },

  async generatePayrollRun(selectionOverrides = {}){
    if(hasRealBackendSession()){
      const state = getStoreState()
      const selection = {
        ...getPayrollSelection(state),
        ...structuredClone(selectionOverrides)
      }
      const normalizedSelectionSalaryType = normalizeStatePayrollSalaryType(selection.salaryType)
      const companyId = getActiveBackendCompanyId()
      const departmentScopeId = getSelectedDepartmentScopeIdFromSelection(state, selection)
      const existingRuns = await this.getPayrollRuns()
      const exactScopeMatcher = (run) =>
        run.period === selection.period &&
        normalizeStatePayrollSalaryType(run.salaryType) === normalizedSelectionSalaryType &&
        String(run.departmentScopeId || "") === String(departmentScopeId || "")
      let matchingRun = existingRuns.find((run) =>
        exactScopeMatcher(run) &&
        ["draft", "pending_approval", "rejected"].includes(String(run.status || "").toLowerCase())
      ) || existingRuns.find((run) => exactScopeMatcher(run)) || null

      if(!matchingRun){
        const createdPayload = await requestBackend(`/companies/${companyId}/payroll-runs`, {
          method: "POST",
          body: JSON.stringify({
            period: selection.period,
            salary_type: normalizedSelectionSalaryType.toLowerCase(),
            department_scope_id: departmentScopeId || null,
            currency_code: getCurrentCompanyFromApiState(state)?.currency || "KES"
          })
        })
        matchingRun = upsertBackendPayrollRunInStore(createdPayload.payroll_run)
      }

      let shouldRegenerate = Boolean(selection.forceRegenerate)
        || String(matchingRun.status || "").toLowerCase() === "draft"

      if(!shouldRegenerate && matchingRun){
        const currentPayload = await getBackendPayrollRunPayload(matchingRun.id)
        const currentRunStatus = String(currentPayload?.run?.status || matchingRun.status || "").trim().toLowerCase()
        const hasPaidItems = Number(currentPayload?.run?.paidItemCount || 0) > 0

        if(currentRunStatus === "posted" || hasPaidItems){
          state.payroll.workspace.forceRegenerate = false
          return structuredClone(currentPayload)
        }

        const expectedEmployeeIds = getExpectedPayrollEmployeesForSelection(state, selection, departmentScopeId)
          .map((employee) => String(employee.id))
          .sort()
        const actualEmployeeIds = (currentPayload.items || [])
          .map((item) => String(item.employeeId))
          .sort()

        shouldRegenerate = expectedEmployeeIds.length !== actualEmployeeIds.length
          || expectedEmployeeIds.some((employeeId, index) => employeeId !== actualEmployeeIds[index])

        if(!shouldRegenerate && isPayrollPayloadUsingStalePayeStructure(currentPayload)){
          shouldRegenerate = true
        }

        if(!shouldRegenerate){
          state.payroll.workspace.forceRegenerate = false
          return structuredClone(currentPayload)
        }
      }

      if(shouldRegenerate){
        const generatedPayload = await requestBackend(`/companies/${companyId}/payroll-runs/${matchingRun.id}/generate`, {
          method: "POST",
          body: JSON.stringify({})
        })
        const run = upsertBackendPayrollRunInStore(generatedPayload.payroll_run)
        const items = replaceBackendPayrollItemsForRunInStore(run.id, generatedPayload.payroll_items || [], run)
        state.payroll.workspace.forceRegenerate = false
        return structuredClone({ run, items })
      }

      state.payroll.workspace.forceRegenerate = false
      return structuredClone(await getBackendPayrollRunPayload(matchingRun.id))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    store.syncApprovalTemplates?.()
    const state = store.getState()
    const selection = {
      ...getPayrollSelection(state),
      ...structuredClone(selectionOverrides)
    }
    const runId = getPayrollRunIdFromSelection(selection)
    const existingRun = store.listPayrollRuns().find((run) => run.id === runId)
    const items = buildPayrollItemsForSelection(state, selection, runId)
    const run = buildPayrollRunRecord(state, selection, runId, items, existingRun)

    store.replacePayrollItemsForRun(runId, items)
    store.savePayrollRun(run)

    return structuredClone({
      run,
      items
    })
  },

  async getOrCreatePayrollRunForCurrentSelection(){
    if(hasRealBackendSession()){
      return this.generatePayrollRun()
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    store.syncApprovalTemplates?.()
    const state = store.getState()
    const selection = getPayrollSelection(state)
    const runId = getPayrollRunIdFromSelection(selection)
    const existingRun = store.listPayrollRuns().find((run) => run.id === runId)
    const existingItems = store.listPayrollItems().filter((item) => item.runId === runId)

    if(existingRun && existingItems.length){
      return structuredClone({
        run: existingRun,
        items: existingItems
      })
    }

    return this.generatePayrollRun(selection)
  },

  async getPayrollRun(runId){
    if(hasRealBackendSession()){
      return structuredClone(await getBackendPayrollRunPayload(runId))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    store.syncApprovalTemplates?.()
    const payload = getPayrollRunPayloadFromStore(store, runId)

    if(!payload){
      throw new Error(`Payroll run ${runId} was not found.`)
    }

    return structuredClone(payload)
  },

  async approvePayrollRun(runId, approverId){
      if(hasRealBackendSession()){
        const companyId = getActiveBackendCompanyId()
        await requestBackend(`/companies/${companyId}/payroll-runs/${runId}/approve`, {
          method: "POST"
        })
        return structuredClone(await getBackendPayrollRunPayload(runId))
      }

    await waitForMockApi()
    const store = getHexaPayStore()
    const payload = getPayrollRunPayloadFromStore(store, runId)

    if(!payload){
      throw new Error(`Payroll run ${runId} was not found.`)
    }

    const approvalIndex = payload.run.approvals.findIndex((approval) => approval.approverId === approverId)
    if(approvalIndex < 0){
      throw new Error("Approver is not assigned to this payroll run.")
    }

    const approval = payload.run.approvals[approvalIndex]
    if(approval.status !== "pending"){
      return structuredClone(payload)
    }

    payload.run.approvals[approvalIndex] = {
      ...approval,
      status: "approved",
      approvedAt: new Date().toISOString(),
      rejectedAt: null,
      rejectionReason: ""
    }
    payload.run.status = derivePayrollRunStatus(payload.run.approvals)
    store.savePayrollRun(payload.run)

    return structuredClone(payload)
  },

  async rejectPayrollRun(runId, approverId, reason = ""){
      if(hasRealBackendSession()){
        const companyId = getActiveBackendCompanyId()
        await requestBackend(`/companies/${companyId}/payroll-runs/${runId}/reject`, {
          method: "POST",
          body: JSON.stringify({
            reason: reason || ""
          })
        })
      return structuredClone(await getBackendPayrollRunPayload(runId))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const payload = getPayrollRunPayloadFromStore(store, runId)

    if(!payload){
      throw new Error(`Payroll run ${runId} was not found.`)
    }

    const approvalIndex = payload.run.approvals.findIndex((approval) => approval.approverId === approverId)
    if(approvalIndex < 0){
      throw new Error("Approver is not assigned to this payroll run.")
    }

    const approval = payload.run.approvals[approvalIndex]
    if(approval.status !== "pending"){
      return structuredClone(payload)
    }

    payload.run.approvals[approvalIndex] = {
      ...approval,
      status: "rejected",
      approvedAt: null,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason || ""
    }
    payload.run.status = derivePayrollRunStatus(payload.run.approvals)
    store.savePayrollRun(payload.run)

    return structuredClone(payload)
  },

  async markPayrollItemPaid(runId, itemId, paid = true){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/payroll-runs/${runId}/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({
          signed: Boolean(paid)
        })
      })

      const updatedRun = upsertBackendPayrollRunInStore(payload.payroll_run)
      const updatedItem = mapBackendPayrollItemToStateItem(payload.payroll_item, updatedRun)
      if(updatedItem){
        upsertById(getStoreState().payroll.items, updatedItem)
      }
      return structuredClone({
        run: updatedRun,
        item: updatedItem
      })
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const payload = getPayrollRunPayloadFromStore(store, runId)

    if(!payload){
      throw new Error(`Payroll run ${runId} was not found.`)
    }

    const itemIndex = payload.items.findIndex((entry) => entry.id === itemId)
    if(itemIndex < 0){
      throw new Error(`Payroll item ${itemId} was not found.`)
    }

    payload.items[itemIndex] = {
      ...payload.items[itemIndex],
      signed: Boolean(paid),
      paid: Boolean(paid),
      paidAt: paid ? new Date().toISOString() : null,
      paidByUserId: paid ? String(getStoreState().auth.currentUserId || "") : ""
    }
    upsertById(getStoreState().payroll.items, payload.items[itemIndex])
    store.savePayrollRun(buildPayrollRunSummaryFromItems(payload.run))

    return structuredClone({
      run: buildPayrollRunSummaryFromItems(payload.run),
      item: payload.items[itemIndex]
    })
  },

  async getPayrollStructureApprovalState(){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/payroll-structure`)
      return structuredClone(mapBackendPayrollStructureStateToClient(payload.payroll_structure))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    store.syncApprovalTemplates?.()
    const state = store.getState()
    return structuredClone({
      ...getWorkflowApprovalState(state, "structure"),
      changes: structuredClone(state.payroll.workspace.structureChanges || [])
    })
  },

  async createPayrollStructureChange(changePayload){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/payroll-structure/changes`, {
        method: "POST",
        body: JSON.stringify({
          kind: changePayload.kind,
          type: changePayload.type,
          amount: Number(changePayload.amount || 0),
          taxable: changePayload.taxable !== false,
          income_category: changePayload.incomeCategory || null,
          salary_type: String(changePayload.salaryType || "").trim().toLowerCase(),
          scope: changePayload.scope,
          scope_label: changePayload.scopeLabel,
          target_label: changePayload.targetLabel,
          target_employee_id: changePayload.targetEmployeeId || null,
          target_department_id: changePayload.targetDepartmentId || null,
          target_role_title: changePayload.targetRoleTitle || null,
          loan_details: changePayload.loanDetails || null
        })
      })
      return structuredClone(mapBackendPayrollStructureStateToClient(payload.payroll_structure))
    }

    await waitForMockApi()
    const state = getStoreState()
    state.payroll.workspace.structureChanges.unshift({
      ...structuredClone(changePayload),
      id: changePayload.id || createStateEntityId("structure-change")
    })
    return structuredClone({
      ...getWorkflowApprovalState(state, "structure"),
      changes: structuredClone(state.payroll.workspace.structureChanges || [])
    })
  },

  async deletePayrollStructureChange(changeId){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/payroll-structure/changes/${changeId}`, {
        method: "DELETE"
      })
      return structuredClone(mapBackendPayrollStructureStateToClient(payload.payroll_structure))
    }

    await waitForMockApi()
    const state = getStoreState()
    state.payroll.workspace.structureChanges = (state.payroll.workspace.structureChanges || []).filter((change) => String(change.id) !== String(changeId))
    return structuredClone({
      ...getWorkflowApprovalState(state, "structure"),
      changes: structuredClone(state.payroll.workspace.structureChanges || [])
    })
  },

  async approvePayrollStructure(approverId){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/payroll-structure/approve`, {
        method: "POST",
        body: JSON.stringify({
          approver_id: approverId
        })
      })
      return structuredClone(mapBackendPayrollStructureStateToClient(payload.payroll_structure))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const state = store.getState()
    return structuredClone(updateWorkflowApprovalState(state, "structure", approverId, "approved"))
  },

  async rejectPayrollStructure(approverId, reason = ""){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/payroll-structure/reject`, {
        method: "POST",
        body: JSON.stringify({
          approver_id: approverId,
          reason: reason || ""
        })
      })
      return structuredClone(mapBackendPayrollStructureStateToClient(payload.payroll_structure))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const state = store.getState()
    return structuredClone(updateWorkflowApprovalState(state, "structure", approverId, "rejected", reason))
  },

  async resetPayrollStructureApprovalState(){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/payroll-structure/reset`, {
        method: "POST",
        body: JSON.stringify({})
      })
      return structuredClone(mapBackendPayrollStructureStateToClient(payload.payroll_structure))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    store.syncApprovalTemplates?.()
    const state = store.getState()
    return structuredClone(resetWorkflowApprovalState(state, "structure"))
  },

  async getPayrollCalendarApprovalState(){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/payroll-calendar`)
      return structuredClone(mapBackendPayrollCalendarStateToClient(payload.payroll_calendar))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    store.syncApprovalTemplates?.()
    const state = store.getState()
    return structuredClone({
      ...getWorkflowApprovalState(state, "calendar"),
      salaryType: state.payroll.workspace.calendarSalaryType,
      paydayDay: state.payroll.workspace.paydayDay,
      paydayMonth: state.payroll.workspace.paydayMonth
    })
  },

  async updatePayrollCalendar(calendarPayload){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/payroll-calendar`, {
        method: "PATCH",
        body: JSON.stringify({
          salary_type: String(calendarPayload.salaryType || "").trim().toLowerCase(),
          payday_day: Number(calendarPayload.paydayDay || 1),
          payday_month: calendarPayload.paydayMonth
        })
      })
      return structuredClone(mapBackendPayrollCalendarStateToClient(payload.payroll_calendar))
    }

    await waitForMockApi()
    const state = getStoreState()
    state.payroll.workspace.calendarSalaryType = calendarPayload.salaryType
    state.payroll.workspace.paydayDay = calendarPayload.paydayDay
    state.payroll.workspace.paydayMonth = calendarPayload.paydayMonth
    return structuredClone({
      ...getWorkflowApprovalState(state, "calendar"),
      salaryType: state.payroll.workspace.calendarSalaryType,
      paydayDay: state.payroll.workspace.paydayDay,
      paydayMonth: state.payroll.workspace.paydayMonth
    })
  },

  async approvePayrollCalendar(approverId){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/payroll-calendar/approve`, {
        method: "POST",
        body: JSON.stringify({
          approver_id: approverId
        })
      })
      return structuredClone(mapBackendPayrollCalendarStateToClient(payload.payroll_calendar))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const state = store.getState()
    return structuredClone(updateWorkflowApprovalState(state, "calendar", approverId, "approved"))
  },

  async rejectPayrollCalendar(approverId, reason = ""){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/payroll-calendar/reject`, {
        method: "POST",
        body: JSON.stringify({
          approver_id: approverId,
          reason: reason || ""
        })
      })
      return structuredClone(mapBackendPayrollCalendarStateToClient(payload.payroll_calendar))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const state = store.getState()
    return structuredClone(updateWorkflowApprovalState(state, "calendar", approverId, "rejected", reason))
  },

  async resetPayrollCalendarApprovalState(){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/payroll-calendar/reset`, {
        method: "POST",
        body: JSON.stringify({})
      })
      return structuredClone(mapBackendPayrollCalendarStateToClient(payload.payroll_calendar))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    store.syncApprovalTemplates?.()
    const state = store.getState()
    return structuredClone(resetWorkflowApprovalState(state, "calendar"))
  },

  async getAttendanceLog(logId){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/attendance-logs/${logId}`)
      const log = upsertBackendAttendanceLogInStore(payload.attendance_log)
      return structuredClone({
        log,
        status: log.approvals.every((approval) => approval.status === "approved") ? "approved" : "pending"
      })
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const context = getAttendanceLogContextFromStore(store, logId)

    if(!context){
      throw new Error(`Attendance log ${logId} was not found.`)
    }

    return structuredClone({
      log: context.log,
      status: context.status
    })
  },

  async approveAttendanceLog(logId, approverId){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/attendance-logs/${logId}/approve`, {
        method: "POST",
        body: JSON.stringify({ approver_id: approverId })
      })
      const log = upsertBackendAttendanceLogInStore(payload.attendance_log)
      return structuredClone({
        log,
        status: log.approvals.every((approval) => approval.status === "approved") ? "approved" : "pending"
      })
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const context = getAttendanceLogContextFromStore(store, logId)

    if(!context){
      throw new Error(`Attendance log ${logId} was not found.`)
    }

    const updated = updateRecordApprovals(context.state, context.log.approvals, approverId, "approved", "", {
      idPrefix: "attendance-approval",
      fallbackKey: String(logId)
    })

    context.log = {
      ...context.log,
      approvals: updated.approvals
    }
    context.state.attendance.records[context.recordIndex] = context.log
    context.status = updated.status

    return structuredClone({
      log: context.log,
      status: context.status
    })
  },

  async getLeaveRequest(requestId){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/leave-requests/${requestId}`)
      const request = upsertBackendLeaveRequestInStore(payload.leave_request)
      return structuredClone({
        request,
        status: String(request.status || "").toLowerCase()
      })
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const context = getLeaveRequestContextFromStore(store, requestId)

    if(!context){
      throw new Error(`Leave request ${requestId} was not found.`)
    }

    return structuredClone({
      request: context.request,
      status: context.approvalStatus
    })
  },

  async approveLeaveRequest(requestId, approverId){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/leave-requests/${requestId}/approve`, {
        method: "POST",
        body: JSON.stringify({ approver_id: approverId })
      })
      const request = upsertBackendLeaveRequestInStore(payload.leave_request)
      return structuredClone({
        request,
        status: String(request.status || "").toLowerCase()
      })
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const context = getLeaveRequestContextFromStore(store, requestId)

    if(!context){
      throw new Error(`Leave request ${requestId} was not found.`)
    }

    const updated = updateRecordApprovals(context.state, context.request.approvals, approverId, "approved", "", {
      idPrefix: "leave-approval",
      fallbackKey: String(requestId)
    })

    context.request = {
      ...context.request,
      approvals: updated.approvals,
      status: deriveLeaveRequestStatus(updated.approvals)
    }
    context.state.leave.records[context.recordIndex] = context.request
    context.approvalStatus = updated.status

    return structuredClone({
      request: context.request,
      status: context.approvalStatus
    })
  },

  async rejectLeaveRequest(requestId, approverId, reason = ""){
      if(hasRealBackendSession()){
        const companyId = getActiveBackendCompanyId()
        const payload = await requestBackend(`/companies/${companyId}/leave-requests/${requestId}/reject`, {
        method: "POST",
        body: JSON.stringify({
          approver_id: approverId,
          reason: reason || ""
        })
      })
      const request = upsertBackendLeaveRequestInStore(payload.leave_request)
      return structuredClone({
        request,
        status: String(request.status || "").toLowerCase()
      })
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const context = getLeaveRequestContextFromStore(store, requestId)

    if(!context){
      throw new Error(`Leave request ${requestId} was not found.`)
    }

    const updated = updateRecordApprovals(context.state, context.request.approvals, approverId, "rejected", reason, {
      idPrefix: "leave-approval",
      fallbackKey: String(requestId)
    })

    context.request = {
      ...context.request,
      approvals: updated.approvals,
      status: deriveLeaveRequestStatus(updated.approvals)
    }
    context.state.leave.records[context.recordIndex] = context.request
    context.approvalStatus = updated.status

      return structuredClone({
        request: context.request,
        status: context.approvalStatus
      })
    },

    async completeLeaveRequest(requestId){
      if(hasRealBackendSession()){
        const companyId = getActiveBackendCompanyId()
        const payload = await requestBackend(`/companies/${companyId}/leave-requests/${requestId}/complete`, {
          method: "POST",
          body: JSON.stringify({})
        })
        const request = upsertBackendLeaveRequestInStore(payload.leave_request)
        return structuredClone({
          request,
          status: String(request.status || "").toLowerCase()
        })
      }

      await waitForMockApi()
      const store = getHexaPayStore()
      const context = getLeaveRequestContextFromStore(store, requestId)

      if(!context){
        throw new Error(`Leave request ${requestId} was not found.`)
      }

      context.request = {
        ...context.request,
        status: "Completed"
      }
      context.state.leave.records[context.recordIndex] = context.request

      return structuredClone({
        request: context.request,
        status: "completed"
      })
    },

    async getEmployees(){
    if(hasRealBackendSession()){
      try{
        const companyId = getActiveBackendCompanyId()
        const payload = await requestBackend(`/companies/${companyId}/employees`, {
          actionLabel: "load employees"
        })
        const employees = replaceCompanyEmployeesInStore(companyId, payload.employees || [])
        return structuredClone(employees)
      } catch (error){
        if(!shouldFallbackToMock(error, { operation: "read" })){
          throw error
        }
      }
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    return structuredClone(store.listEmployees())
  },

  async getCompany(){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}`)
      return structuredClone(upsertBackendCompanyInStore(payload.company))
    }

    await waitForMockApi()
    return structuredClone(getCurrentCompanyFromApiState(getStoreState()))
  },

  async updateCompany(payload){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const response = await requestBackend(`/companies/${companyId}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      })
      return structuredClone(upsertBackendCompanyInStore(response.company))
    }

    await waitForMockApi()
    const state = getStoreState()
    const company = getCurrentCompanyFromApiState(state)
    if(!company){
      throw new Error("No active company was found.")
    }

    Object.assign(company, {
      name: payload.name ?? company.name,
      industry: payload.industry ?? company.industry,
      email: payload.email ?? company.email,
      currency: payload.currency_code ?? company.currency,
      logoUrl: payload.logo_url ?? company.logoUrl
    })

    return structuredClone(company)
  },

  async getMemberships(){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/memberships`)
      return structuredClone(replaceBackendMembershipsInStore(companyId, payload.memberships || []))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    return structuredClone(store.getState().company.memberships.map((membership) => ({
      id: membership.id,
      userId: membership.userId,
      name: getStoreState().auth.users.find((user) => user.id === membership.userId)?.displayName || "Unknown User",
      role: membership.role,
      email: getStoreState().auth.users.find((user) => user.id === membership.userId)?.email || "",
      status: membership.status
    })))
  },

  async createMembership(payload){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const response = await requestBackend(`/companies/${companyId}/memberships`, {
        method: "POST",
        body: JSON.stringify(payload)
      })
      await this.getMemberships()
      return structuredClone(mapBackendMembershipResponseToStateMember(response.membership))
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const state = store.getState()
    const companyId = getActiveBackendCompanyId()
    const activeCompany = state.company.companies.find((company) => String(company.id) === String(companyId)) || null
    const normalizedCompanyEmail = String(activeCompany?.email || "").trim().toLowerCase()
    const existingMembershipCount = state.company.memberships.filter((membership) =>
      String(membership.companyId) === String(companyId) &&
      String(membership.status || "").toLowerCase() !== "removed" &&
      String(state.auth.users.find((user) => String(user.id) === String(membership.userId))?.email || "").trim().toLowerCase() !== normalizedCompanyEmail
    ).length
    const effectiveRole = existingMembershipCount < 3 ? "ADMIN" : String(payload.role || "VIEWER").trim().toUpperCase()
    const userId = `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
    const membershipId = `membership-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
    state.auth.users.push({
      id: userId,
      email: payload.email,
      displayName: payload.display_name || payload.email,
      role: effectiveRole,
      avatarUrl: "",
      status: "invited"
    })
    state.company.memberships.push({
      id: membershipId,
      companyId,
      userId,
      role: effectiveRole,
      status: "invited"
    })

    return {
      id: membershipId,
      userId,
      name: payload.display_name || payload.email,
      title: payload.title || "",
      role: normalizeBackendRoleLabel(effectiveRole),
      email: payload.email,
      status: "active"
    }
  },

  async updateMembership(membershipId, payload){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const response = await requestBackend(`/companies/${companyId}/memberships/${membershipId}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      })
      return structuredClone(applyBackendMembershipUpdateToStore(companyId, response.membership))
    }

    await waitForMockApi()
    const state = getStoreState()
    const membership = state.company.memberships.find((item) => String(item.id) === String(membershipId))
    if(!membership){
      throw new Error(`Membership ${membershipId} was not found.`)
    }

    membership.role = payload.role || membership.role
    membership.status = payload.status || membership.status
    return structuredClone(membership)
  },

  async deleteMembership(membershipId){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      await requestBackend(`/companies/${companyId}/memberships/${membershipId}`, {
        method: "DELETE"
      })
      await this.getMemberships()
      return { success: true, membershipId }
    }

    await waitForMockApi()
    const state = getStoreState()
    state.company.memberships = state.company.memberships.filter((membership) => membership.id !== membershipId)
    return { success: true, membershipId }
  },

  async getDepartments(){
      if(hasRealBackendSession()){
        try{
          const companyId = getActiveBackendCompanyId()
          const payload = await requestBackend(`/companies/${companyId}/departments`, {
            actionLabel: "load departments"
          })
          return structuredClone(replaceBackendDepartmentsInStore(companyId, payload.departments || []))
      } catch (error){
        if(!shouldFallbackToMock(error, { operation: "read" })){
          throw error
        }
      }
    }

    await waitForMockApi()
      const companyId = getActiveBackendCompanyId()
      return structuredClone(getStoreState().company.departments.filter((department) => department.companyId === companyId))
    },

    async createDepartment(departmentPayload){
      if(hasRealBackendSession()){
        const companyId = getActiveBackendCompanyId()
        const payload = await requestBackend(`/companies/${companyId}/departments`, {
          method: "POST",
          body: JSON.stringify(toBackendDepartmentPayload(departmentPayload))
        })
        const state = getStoreState()
        const mappedDepartment = mapBackendDepartmentToStateDepartment(payload.department)
        upsertById(state.company.departments, mappedDepartment)
        return structuredClone(mappedDepartment)
      }

      await waitForMockApi()
      const companyId = getActiveBackendCompanyId()
      const localDepartment = {
        ...structuredClone(departmentPayload),
        id: departmentPayload.id || `dept-${Date.now()}`,
        companyId
      }
      upsertById(getStoreState().company.departments, localDepartment)
      return structuredClone(localDepartment)
    },

    async updateDepartment(departmentId, updates){
      if(hasRealBackendSession()){
        const companyId = getActiveBackendCompanyId()
        const payload = await requestBackend(`/companies/${companyId}/departments/${departmentId}`, {
          method: "PATCH",
          body: JSON.stringify(toBackendDepartmentPayload(updates))
        })
        const state = getStoreState()
        const mappedDepartment = mapBackendDepartmentToStateDepartment(payload.department)
        upsertById(state.company.departments, mappedDepartment)
        return structuredClone(mappedDepartment)
      }

      await waitForMockApi()
      const existingDepartment = getStoreState().company.departments.find((department) => department.id === departmentId)
      if(!existingDepartment){
        throw new Error(`Department ${departmentId} was not found.`)
      }

      const updatedDepartment = {
        ...existingDepartment,
        ...structuredClone(updates),
        id: existingDepartment.id
      }
      upsertById(getStoreState().company.departments, updatedDepartment)
      return structuredClone(updatedDepartment)
    },

    async deleteDepartment(departmentId){
      if(hasRealBackendSession()){
        const companyId = getActiveBackendCompanyId()
        const payload = await requestBackend(`/companies/${companyId}/departments/${departmentId}`, {
          method: "DELETE"
        })
        const state = getStoreState()
        const departmentIndex = state.company.departments.findIndex((department) => department.id === departmentId)
        if(departmentIndex >= 0){
          state.company.departments.splice(departmentIndex, 1)
        }
        return structuredClone(payload.department || { id: departmentId, archived: true })
      }

      await waitForMockApi()
      const state = getStoreState()
      const departmentIndex = state.company.departments.findIndex((department) => department.id === departmentId)
      if(departmentIndex < 0){
        throw new Error(`Department ${departmentId} was not found.`)
      }

      const [deletedDepartment] = state.company.departments.splice(departmentIndex, 1)
      return structuredClone(deletedDepartment)
    },

  async getContracts(){
    if(hasRealBackendSession()){
      try{
        const companyId = getActiveBackendCompanyId()
        const payload = await requestBackend(`/companies/${companyId}/contracts`, {
          actionLabel: "load contracts"
        })
        return structuredClone(replaceBackendContractsInStore(companyId, payload.contracts || []))
      } catch (error){
        if(!shouldFallbackToMock(error, { operation: "read" })){
          throw error
        }
      }
    }

    await waitForMockApi()
    const companyId = getActiveBackendCompanyId()
    return structuredClone(getStoreState().contracts.records.filter((contract) => contract.companyId === companyId))
  },

  async createContract(contractPayload){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/contracts`, {
        method: "POST",
        body: JSON.stringify(toBackendContractPayload(contractPayload))
      })
      const state = getStoreState()
      const mappedContract = mapBackendContractToStateContract(
        withLocalContractPresentationFallback(payload.contract, contractPayload)
      )
      upsertById(state.contracts.records, mappedContract)
      return structuredClone(mappedContract)
    }

    await waitForMockApi()
    const companyId = getActiveBackendCompanyId()
    const localContract = {
      ...structuredClone(contractPayload),
      id: contractPayload.id || `contract-${Date.now()}`,
      companyId
    }
    upsertById(getStoreState().contracts.records, localContract)
    return structuredClone(localContract)
  },

  async updateContract(contractId, updates){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/contracts/${contractId}`, {
        method: "PATCH",
        body: JSON.stringify(toBackendContractPayload(updates))
      })
      const state = getStoreState()
      const mappedContract = mapBackendContractToStateContract(
        withLocalContractPresentationFallback(payload.contract, updates)
      )
      upsertById(state.contracts.records, mappedContract)
      return structuredClone(mappedContract)
    }

    await waitForMockApi()
    const existingContract = getStoreState().contracts.records.find((contract) => contract.id === contractId)
    if(!existingContract){
      throw new Error(`Contract ${contractId} was not found.`)
    }

    const updatedContract = {
      ...existingContract,
      ...structuredClone(updates),
      id: existingContract.id
    }
    upsertById(getStoreState().contracts.records, updatedContract)
    return structuredClone(updatedContract)
  },

  async deleteContract(contractId){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/contracts/${contractId}`, {
        method: "DELETE"
      })
      const state = getStoreState()
      const contractIndex = state.contracts.records.findIndex((contract) => String(contract.id) === String(contractId))
      if(contractIndex >= 0){
        state.contracts.records.splice(contractIndex, 1)
      }
      return structuredClone(mapBackendContractToStateContract(payload.contract) || { id: contractId, deleted: true })
    }

    await waitForMockApi()
    const state = getStoreState()
    const contractIndex = state.contracts.records.findIndex((contract) => String(contract.id) === String(contractId))
    if(contractIndex < 0){
      throw new Error(`Contract ${contractId} was not found.`)
    }

    const [deletedContract] = state.contracts.records.splice(contractIndex, 1)
    return structuredClone(deletedContract)
  },

  async getHolidays(){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/holidays`)
      return structuredClone(replaceBackendHolidaysInStore(companyId, payload.holidays || []))
    }

    await waitForMockApi()
    const companyId = getActiveBackendCompanyId()
    const state = getStoreState()
    return structuredClone(
      state.holidays.companyRecords.concat(state.holidays.nationalRecords).filter((holiday) => holiday.companyId === companyId)
    )
  },

  async createHoliday(holidayPayload){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/holidays`, {
        method: "POST",
        body: JSON.stringify(toBackendHolidayPayload(holidayPayload))
      })
      return structuredClone(upsertBackendHolidayInStore(payload.holiday))
    }

    await waitForMockApi()
    const companyId = getActiveBackendCompanyId()
    const localHoliday = {
      ...structuredClone(holidayPayload),
      id: holidayPayload.id || `holiday-${Date.now()}`,
      companyId
    }
    const targetCollection = String(localHoliday.scope || "company").toLowerCase() === "national"
      ? getStoreState().holidays.nationalRecords
      : getStoreState().holidays.companyRecords
    upsertById(targetCollection, localHoliday)
    return structuredClone(localHoliday)
  },

  async updateHoliday(holidayId, updates){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/holidays/${holidayId}`, {
        method: "PATCH",
        body: JSON.stringify(toBackendHolidayPayload(updates))
      })
      return structuredClone(upsertBackendHolidayInStore(payload.holiday))
    }

    await waitForMockApi()
    const existingHoliday = removeBackendHolidayFromStore(holidayId)
    if(!existingHoliday){
      throw new Error(`Holiday ${holidayId} was not found.`)
    }
    const updatedHoliday = { ...existingHoliday, ...structuredClone(updates), id: existingHoliday.id }
    const targetCollection = String(updatedHoliday.scope || "company").toLowerCase() === "national"
      ? getStoreState().holidays.nationalRecords
      : getStoreState().holidays.companyRecords
    upsertById(targetCollection, updatedHoliday)
    return structuredClone(updatedHoliday)
  },

  async deleteHoliday(holidayId){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      await requestBackend(`/companies/${companyId}/holidays/${holidayId}`, {
        method: "DELETE"
      })
      const deletedHoliday = removeBackendHolidayFromStore(holidayId)
      return structuredClone(deletedHoliday || { id: holidayId, archived: true })
    }

    await waitForMockApi()
    const deletedHoliday = removeBackendHolidayFromStore(holidayId)
    if(!deletedHoliday){
      throw new Error(`Holiday ${holidayId} was not found.`)
    }
    return structuredClone(deletedHoliday)
  },

  async getPayrollRuns(){
    if(hasRealBackendSession()){
      try{
        const companyId = getActiveBackendCompanyId()
        const payload = await requestBackend(`/companies/${companyId}/payroll-runs`, {
          actionLabel: "load payroll runs"
        })
        return structuredClone(replaceBackendPayrollRunsInStore(companyId, payload.payroll_runs || []))
      } catch (error){
        if(!shouldFallbackToMock(error, { operation: "read" })){
          throw error
        }
      }
    }

    await waitForMockApi()
    const companyId = getActiveBackendCompanyId()
    return structuredClone(
      getStoreState().payroll.runs
        .filter((run) => run.companyId === companyId)
        .map((run) => buildPayrollRunSummaryFromItems(run))
    )
  },

  async getAttendanceLogs(){
    if(hasRealBackendSession()){
      try{
        const companyId = getActiveBackendCompanyId()
        const payload = await requestBackend(`/companies/${companyId}/attendance-logs`, {
          actionLabel: "load attendance records"
        })
        return structuredClone(replaceBackendAttendanceLogsInStore(companyId, payload.attendance_logs || []))
      } catch (error){
        if(!shouldFallbackToMock(error, { operation: "read" })){
          throw error
        }
      }
    }

    await waitForMockApi()
    const companyId = getActiveBackendCompanyId()
    return structuredClone(getStoreState().attendance.records.filter((log) => log.companyId === companyId))
  },

  async getLeaveRequests(){
    if(hasRealBackendSession()){
      try{
        const companyId = getActiveBackendCompanyId()
        const payload = await requestBackend(`/companies/${companyId}/leave-requests`, {
          actionLabel: "load leave requests"
        })
        return structuredClone(replaceBackendLeaveRequestsInStore(companyId, payload.leave_requests || []))
      } catch (error){
        if(!shouldFallbackToMock(error, { operation: "read" })){
          throw error
        }
      }
    }

    await waitForMockApi()
    const companyId = getActiveBackendCompanyId()
    return structuredClone(getStoreState().leave.records.filter((request) => request.companyId === companyId))
  },

  async createAttendanceLog(payload){
    if(hasRealBackendSession()){
      const companyId = getActiveBackendCompanyId()
      const employeeId = String(payload.employeeId || "").trim()
      const entryDate = String(payload.date || "").trim()
      const checkIn = normalizeBackendTimeValue(payload.checkIn)
      const checkOut = normalizeBackendTimeValue(payload.checkOut)

      if(!isObjectIdLike(employeeId)){
        throw new Error("Select a live employee record before saving attendance.")
      }

      const response = await requestBackend(`/companies/${companyId}/attendance-logs`, {
        method: "POST",
        body: JSON.stringify({
          employee_id: employeeId,
          date: entryDate,
          check_in: checkIn,
          ...(checkOut ? { check_out: checkOut } : {}),
          mode: normalizeAttendanceModeForBackend(payload.mode)
        })
      })
      return structuredClone(upsertBackendAttendanceLogInStore(response.attendance_log))
    }

    await waitForMockApi()
    const state = getStoreState()
    const employee = state.employees.records.find((record) => String(record.id) === String(payload.employeeId))
    const logRecord = createAttendanceLogModel({
      id: createStateEntityId("attendance"),
      companyId: payload.companyId,
      employeeId: payload.employeeId,
      employeeName: payload.employeeName || employee?.fullName || "",
      departmentId: payload.departmentId || employee?.departmentId || "",
      departmentName: payload.departmentName || "",
      roleTitle: payload.roleTitle || employee?.roleTitle || "",
      date: payload.date,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      mode: payload.mode || "Manual",
      approvals: payload.approvals || []
    })
    upsertById(state.attendance.records, logRecord)
    return structuredClone(logRecord)
  },

    async createLeaveRequest(payload){
      if(hasRealBackendSession()){
        const companyId = getActiveBackendCompanyId()
        const reason = String(payload.reason || "").trim()
        const response = await requestBackend(`/companies/${companyId}/leave-requests`, {
          method: "POST",
          body: JSON.stringify({
            employee_id: payload.employeeId,
            leave_type: normalizeStateLeaveTypeForBackend(payload.leaveType),
            from_date: payload.fromDate,
            to_date: payload.toDate,
            ...(reason ? { reason } : {})
          })
        })
        return structuredClone(upsertBackendLeaveRequestInStore(response.leave_request))
      }

    await waitForMockApi()
    const request = createLeaveRequestModel({
      id: createStateEntityId("leave"),
      companyId: payload.companyId,
      employeeId: payload.employeeId,
      employeeName: payload.employeeName,
      leaveType: payload.leaveType,
      departmentId: payload.departmentId,
      departmentName: payload.departmentName,
      fromDate: payload.fromDate,
      toDate: payload.toDate,
      requestedDate: payload.requestedDate || new Date().toISOString().slice(0, 10),
      status: "Pending",
      approvals: payload.approvals || []
    })
    upsertById(getStoreState().leave.records, request)
    return structuredClone(request)
  },

  async createEmployee(employeePayload){
      if(hasRealBackendSession()){
        try{
          const companyId = getActiveBackendCompanyId()
          const payload = await requestBackend(`/companies/${companyId}/employees`, {
            method: "POST",
            actionLabel: "create the employee record",
            body: JSON.stringify(toBackendEmployeePayload(employeePayload))
          })
          return structuredClone(
            upsertBackendEmployeeInStore(
              withLocalEmployeePresentationFallback(
                withLocalDepartmentFallback(payload.employee, employeePayload),
                employeePayload
              )
            )
          )
        } catch (error){
          if(!shouldFallbackToMock(error, { operation: "write" })){
            throw error
        }
      }
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const createdEmployee = store.saveEmployee(structuredClone(employeePayload))
    return structuredClone(createdEmployee)
  },

  async updateEmployee(employeeId, updates){
      if(hasRealBackendSession()){
        try{
          const store = getHexaPayStore()
          const existingEmployee = store.findEmployeeById(employeeId)

        if(!existingEmployee){
          throw new Error(`Employee ${employeeId} was not found.`)
        }

        const companyId = getActiveBackendCompanyId()
          const payload = await requestBackend(`/companies/${companyId}/employees/${employeeId}`, {
            method: "PATCH",
            actionLabel: "update the employee record",
            body: JSON.stringify(toBackendEmployeeUpdatePayload(existingEmployee, structuredClone(updates)))
          })
          return structuredClone(
            upsertBackendEmployeeInStore(
              withLocalEmployeePresentationFallback(
                withLocalDepartmentFallback(payload.employee, {
                  ...existingEmployee,
                  ...structuredClone(updates),
                  id: employeeId
                }),
                {
                  ...existingEmployee,
                  ...structuredClone(updates),
                  id: employeeId
                }
              )
            )
          )
        } catch (error){
          if(!shouldFallbackToMock(error, { operation: "write" })){
            throw error
        }
      }
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const existingEmployee = store.findEmployeeById(employeeId)

    if(!existingEmployee){
      throw new Error(`Employee ${employeeId} was not found.`)
    }

    const updatedEmployee = store.saveEmployee({
      ...existingEmployee,
      ...structuredClone(updates),
      id: existingEmployee.id
    })

    return structuredClone(updatedEmployee)
  },

  async deleteEmployee(employeeId){
    if(hasRealBackendSession()){
      try{
        const companyId = getActiveBackendCompanyId()
        await requestBackend(`/companies/${companyId}/employees/${employeeId}`, {
          method: "DELETE",
          actionLabel: "remove the employee record"
        })
        const deletedEmployee = removeBackendEmployeeFromStore(employeeId)

        if(!deletedEmployee){
          throw new Error(`Employee ${employeeId} was not found.`)
        }

        return structuredClone(deletedEmployee)
      } catch (error){
        if(!shouldFallbackToMock(error, { operation: "write" })){
          throw error
        }
      }
    }

    await waitForMockApi()
    const store = getHexaPayStore()
    const deletedEmployee = store.removeEmployee(employeeId)

    if(!deletedEmployee){
      throw new Error(`Employee ${employeeId} was not found.`)
    }

    return structuredClone(deletedEmployee)
  },

  async getSettings(){
    const companyId = getActiveBackendCompanyId()
    return requestBackend(`/companies/${companyId}/settings`)
  },

  async updateCurrencySettings(payload){
    const companyId = getActiveBackendCompanyId()
    return requestBackend(`/companies/${companyId}/settings/currency`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    })
  },

  async getTaxSettings(){
    const companyId = getActiveBackendCompanyId()
    return requestBackend(`/companies/${companyId}/settings/tax`)
  },

  async getFinancialRules(){
    const companyId = getActiveBackendCompanyId()
    return requestBackend(`/companies/${companyId}/settings/financial-rules`)
  },

  async createFinancialRule(payload){
    const companyId = getActiveBackendCompanyId()
    return requestBackend(`/companies/${companyId}/settings/financial-rules`, {
      method: "POST",
      body: JSON.stringify(payload)
    })
  },

  async updateFinancialRule(ruleId, payload){
    const companyId = getActiveBackendCompanyId()
    return requestBackend(`/companies/${companyId}/settings/financial-rules/${ruleId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    })
  },

  async deleteFinancialRule(ruleId){
    const companyId = getActiveBackendCompanyId()
    return requestBackend(`/companies/${companyId}/settings/financial-rules/${ruleId}`, {
      method: "DELETE"
    })
  },

  async exportEmployees(filters = {}){
      if(!hasRealBackendSession()){
        throw new Error("Sign in to a live backend session before exporting employees.")
    }

    const companyId = getActiveBackendCompanyId()
    const payload = await requestBackend(`/companies/${companyId}/exports/employees`, {
      method: "POST",
      body: JSON.stringify({ filters })
    })
    const exportJob = payload.export_job
    const fileResponse = await requestBackendFile(exportJob.download_url || `/companies/${companyId}/exports/${exportJob.id}/download`)
    triggerBrowserDownload(fileResponse)
      return {
        exportJob,
        fileName: fileResponse.fileName
      }
    },

    async exportContracts(){
      if(!hasRealBackendSession()){
        throw new Error("Sign in to a live backend session before exporting contracts.")
      }

      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/exports/contracts`, {
        method: "POST"
      })
      const exportJob = payload.export_job
      const fileResponse = await requestBackendFile(exportJob.download_url || `/companies/${companyId}/exports/${exportJob.id}/download`)
      triggerBrowserDownload(fileResponse)
      return {
        exportJob,
        fileName: fileResponse.fileName
      }
    },

  async exportDepartment(departmentId){
      if(!hasRealBackendSession()){
        throw new Error("Sign in to a live backend session before exporting a department.")
      }

      if(!departmentId){
        throw new Error("A department must be selected before exporting.")
      }

      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/exports/departments`, {
        method: "POST",
        body: JSON.stringify({
          department_id: departmentId
        })
      })
      const exportJob = payload.export_job
      const fileResponse = await requestBackendFile(exportJob.download_url || `/companies/${companyId}/exports/${exportJob.id}/download`)
      triggerBrowserDownload(fileResponse)
      return {
        exportJob,
        fileName: fileResponse.fileName
      }
    },

    async exportAttendance(filters = {}){
      if(!hasRealBackendSession()){
        throw new Error("Sign in to a live backend session before exporting attendance.")
      }

      const companyId = getActiveBackendCompanyId()
      const payload = await requestBackend(`/companies/${companyId}/exports/attendance`, {
        method: "POST",
        body: JSON.stringify({ filters })
      })
      const exportJob = payload.export_job
      const fileResponse = await requestBackendFile(exportJob.download_url || `/companies/${companyId}/exports/${exportJob.id}/download`)
      triggerBrowserDownload(fileResponse)
      return {
        exportJob,
        fileName: fileResponse.fileName
      }
    },

    async exportPayroll(payrollRunId){
      if(!hasRealBackendSession()){
        throw new Error("Sign in to a live backend session before exporting payroll.")
    }

    if(!payrollRunId){
      throw new Error("A payroll run must be selected before exporting payroll.")
    }

    const companyId = getActiveBackendCompanyId()
    const payload = await requestBackend(`/companies/${companyId}/exports/payroll`, {
      method: "POST",
      body: JSON.stringify({
        payroll_run_id: payrollRunId
      })
    })
    const exportJob = payload.export_job
    const fileResponse = await requestBackendFile(exportJob.download_url || `/companies/${companyId}/exports/${exportJob.id}/download`)
    triggerBrowserDownload(fileResponse)
    return {
      exportJob,
      fileName: fileResponse.fileName
    }
  },

  async createBackup(){
    if(!hasRealBackendSession()){
      throw new Error("Sign in to a live backend session before creating a backup.")
    }

    const companyId = getActiveBackendCompanyId()
    const payload = await requestBackend(`/companies/${companyId}/backups`, {
      method: "POST"
    })
    const backup = payload.backup
    const fileResponse = await requestBackendFile(backup.download_url || `/companies/${companyId}/backups/${backup.id}`)
    triggerBrowserDownload(fileResponse)
    return {
      backup,
      fileName: fileResponse.fileName
    }
  },

  async restoreBackup(backupPayload){
    if(!hasRealBackendSession()){
      throw new Error("Sign in to a live backend session before restoring a backup.")
    }

    if(!backupPayload || typeof backupPayload !== "object" || Array.isArray(backupPayload)){
      throw new Error("Select a valid HexaPay backup file before restoring.")
    }

    const companyId = getActiveBackendCompanyId()
    const payload = await requestBackend(`/companies/${companyId}/backups/restore`, {
      method: "POST",
      actionLabel: "restore the company backup",
      body: JSON.stringify({
        backup_json: backupPayload
      })
    })
    return payload.restore
  },

  async restoreBackupByJobId(backupJobId){
    if(!hasRealBackendSession()){
      throw new Error("Sign in to a live backend session before restoring a backup.")
    }

    if(!backupJobId){
      throw new Error("Select a saved backup before restoring.")
    }

    const companyId = getActiveBackendCompanyId()
    const payload = await requestBackend(`/companies/${companyId}/backups/restore`, {
      method: "POST",
      actionLabel: "restore the company backup",
      body: JSON.stringify({
        backup_job_id: backupJobId
      })
    })
    return payload.restore
  }
}
