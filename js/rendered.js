
// COMPANY DROPDOWN

const companyBtn = document.getElementById("companyBtn")
const dropdown = document.getElementById("companyDropdown")
const settingsToggle = document.getElementById("settingsToggle")
const settingsWindow = document.getElementById("settingsWindow")
const settingsClose = document.getElementById("settingsClose")
const notificationsToggle = document.getElementById("notificationsToggle")
const notificationsWindow = document.getElementById("notificationsWindow")
const notificationsClose = document.getElementById("notificationsClose")
const notificationToastHost = document.getElementById("notificationToastHost")
const companyList = document.getElementById("companyList")
const addCompanyTrigger = document.getElementById("addCompanyTrigger")
const profileToggle = document.getElementById("profileToggle")
const profileWindow = document.getElementById("profileWindow")
const profileClose = document.getElementById("profileClose")
const topbarProfileImage = document.getElementById("topbarProfileImage")
const topbarProfileName = document.getElementById("topbarProfileName")
const topbarProfileRole = document.getElementById("topbarProfileRole")
const companyEditName = document.getElementById("companyEditName")
const companyIndustry = document.getElementById("companyIndustry")
const companyEmail = document.getElementById("companyEmail")
const companyLogoInput = document.getElementById("companyLogoInput")
const companyLogoPreview = document.getElementById("companyLogoPreview")
const saveCompanyProfileButton = document.getElementById("saveCompanyProfile")
const companyLogoutButton = document.getElementById("companyLogoutButton")
const currencySelect = document.getElementById("currencySelect")
const applyCurrencyButton = document.getElementById("applyCurrencyButton")
const currencyPreview = document.getElementById("currencyPreview")
const memberList = document.getElementById("memberList")
const themeOptions = document.querySelectorAll("[data-theme-option]")
const fontScaleRange = document.getElementById("fontScaleRange")
const fontScaleValue = document.getElementById("fontScaleValue")
const backupDataButton = document.getElementById("backupDataButton")
const restoreBackupButton = document.getElementById("restoreBackupButton")
const restoreBackupInput = document.getElementById("restoreBackupInput")
const exportEmployeeDataButton = document.getElementById("exportEmployeeDataButton")
const employeeToolbarExportButton = document.getElementById("employeeToolbarExportButton")
const contractExportButton = document.getElementById("contractExportButton")
const activityHistoryList = document.getElementById("activityHistoryList")
const employeeTableBody = document.getElementById("employeeTable")
const employeeSearchInput = document.getElementById("employeeSearchInput")
const employeeDepartmentFilter = document.getElementById("employeeDepartmentFilter")
const employeeEmploymentTypeFilter = document.getElementById("employeeEmploymentTypeFilter")
const employeeStatusFilter = document.getElementById("employeeStatusFilter")
const employeeSortFilter = document.getElementById("employeeSortFilter")
const totalEmployeesValue = document.getElementById("totalEmployeesValue")
const activeEmployeesValue = document.getElementById("activeEmployeesValue")
const monthlyPayrollValue = document.getElementById("monthlyPayrollValue")
const pendingPayrollValue = document.getElementById("pendingPayrollValue")
const pendingPayrollType = document.getElementById("pendingPayrollType")
const overviewPayrollRange = document.getElementById("overviewPayrollRange")
const overviewWorkforceFilter = document.getElementById("overviewWorkforceFilter")
const profileHeroImage = document.getElementById("profileHeroImage")
const profileHeroName = document.getElementById("profileHeroName")
const profileHeroRole = document.getElementById("profileHeroRole")
const profileLoginEmail = document.getElementById("profileLoginEmail")
const profileLoginPassword = document.getElementById("profileLoginPassword")
const profileLoginButton = document.getElementById("profileLoginButton")
const profileSignupCompany = document.getElementById("profileSignupCompany")
const profileSignupEmail = document.getElementById("profileSignupEmail")
const profileSignupLogo = document.getElementById("profileSignupLogo")
const profileSignupLogoPreview = document.getElementById("profileSignupLogoPreview")
const profileSignupPassword = document.getElementById("profileSignupPassword")
const profileSignupButton = document.getElementById("profileSignupButton")
const userProfileCard = document.getElementById("userProfileCard")
const profileAuthStatus = document.getElementById("profileAuthStatus")
const profileUserSignupName = document.getElementById("profileUserSignupName")
const profileUserSignupEmail = document.getElementById("profileUserSignupEmail")
const profileUserSignupPassword = document.getElementById("profileUserSignupPassword")
const profileUserSignupPasswordRepeat = document.getElementById("profileUserSignupPasswordRepeat")
const profileUserSignupButton = document.getElementById("profileUserSignupButton")
const profileUserLoginEmail = document.getElementById("profileUserLoginEmail")
const profileUserLoginPassword = document.getElementById("profileUserLoginPassword")
const profileUserLoginButton = document.getElementById("profileUserLoginButton")
const employeeModal = document.getElementById("employeeModal")
const employeeProfileWindow = document.getElementById("employeeProfileWindow")
const employeeModalTitle = document.getElementById("employeeModalTitle")
const employeeSaveButton = document.getElementById("employeeSaveButton")
const empName = document.getElementById("empName")
const empIdentification = document.getElementById("empIdentification")
const empAccountNumber = document.getElementById("empAccountNumber")
const empAccountDetails = document.getElementById("empAccountDetails")
const empDept = document.getElementById("empDept")
const empRole = document.getElementById("empRole")
const empDate = document.getElementById("empDate")
const empType = document.getElementById("empType")
const empPaymentBasisRow = document.getElementById("empPaymentBasisRow")
const empPaymentBasis = document.getElementById("empPaymentBasis")
const empSalary = document.getElementById("empSalary")
const empStatus = document.getElementById("empStatus")
const empApplyTaxButton = document.getElementById("empApplyTaxButton")
const empTaxOptions = document.getElementById("empTaxOptions")
const empApplyPaye = document.getElementById("empApplyPaye")
const empApplyShif = document.getElementById("empApplyShif")
const empApplyNssf = document.getElementById("empApplyNssf")
const empApplyHousingLevy = document.getElementById("empApplyHousingLevy")
const empLoanEnabled = document.getElementById("empLoanEnabled")
const empLoanFields = document.getElementById("empLoanFields")
const empLoanName = document.getElementById("empLoanName")
const empLoanPrincipal = document.getElementById("empLoanPrincipal")
const empLoanBalance = document.getElementById("empLoanBalance")
const empLoanInstallment = document.getElementById("empLoanInstallment")
const empLoanFrequency = document.getElementById("empLoanFrequency")
const empLoanInstallments = document.getElementById("empLoanInstallments")
const empLoanPaidInstallments = document.getElementById("empLoanPaidInstallments")
const empLoanNextDate = document.getElementById("empLoanNextDate")
const empProfileImage = document.getElementById("empProfileImage")
const empDocuments = document.getElementById("empDocuments")
const empDocumentsPreview = document.getElementById("empDocumentsPreview")
const employeeAvatarPreview = document.getElementById("employeeAvatarPreview")
const profileEmployeeAvatar = document.getElementById("profileEmployeeAvatar")
const profileEmpProfileImage = document.getElementById("profileEmpProfileImage")
const profileEmpName = document.getElementById("profileEmpName")
const profileEmpIdentification = document.getElementById("profileEmpIdentification")
const profileEmpAccountNumber = document.getElementById("profileEmpAccountNumber")
const profileEmpAccountDetails = document.getElementById("profileEmpAccountDetails")
const profileEmpDept = document.getElementById("profileEmpDept")
const profileEmpRole = document.getElementById("profileEmpRole")
const profileEmpDate = document.getElementById("profileEmpDate")
const profileEmpType = document.getElementById("profileEmpType")
const profileEmpPaymentBasisRow = document.getElementById("profileEmpPaymentBasisRow")
const profileEmpPaymentBasis = document.getElementById("profileEmpPaymentBasis")
const profileEmpSalary = document.getElementById("profileEmpSalary")
const profileEmpUnpaidBalance = document.getElementById("profileEmpUnpaidBalance")
const profileEmpPayrollNumber = document.getElementById("profileEmpPayrollNumber")
const saveEmployeeProfileButton = document.getElementById("saveEmployeeProfileButton")
const employeeFinancialSummary = document.getElementById("employeeFinancialSummary")
const profileSalaryEditor = document.getElementById("profileSalaryEditor")
const profileApplyTaxButton = document.getElementById("profileApplyTaxButton")
const profileTaxOptions = document.getElementById("profileTaxOptions")
const profileApplyPaye = document.getElementById("profileApplyPaye")
const profileApplyShif = document.getElementById("profileApplyShif")
const profileApplyNssf = document.getElementById("profileApplyNssf")
const profileApplyHousingLevy = document.getElementById("profileApplyHousingLevy")
const profileLoanEnabled = document.getElementById("profileLoanEnabled")
const profileLoanFields = document.getElementById("profileLoanFields")
const profileLoanName = document.getElementById("profileLoanName")
const profileLoanPrincipal = document.getElementById("profileLoanPrincipal")
const profileLoanBalance = document.getElementById("profileLoanBalance")
const profileLoanInstallment = document.getElementById("profileLoanInstallment")
const profileLoanFrequency = document.getElementById("profileLoanFrequency")
const profileLoanInstallments = document.getElementById("profileLoanInstallments")
const profileLoanPaidInstallments = document.getElementById("profileLoanPaidInstallments")
const profileLoanNextDate = document.getElementById("profileLoanNextDate")
const saveEmployeeFinancialButton = document.getElementById("saveEmployeeFinancialButton")
const salaryHistoryBody = document.getElementById("salaryHistoryBody")
const profileDocumentsGrid = document.getElementById("profileDocumentsGrid")
const departmentCards = document.getElementById("departmentCards")
const departmentCount = document.getElementById("departmentCount")

function syncPasswordVisibilityToggle(button, input, shouldShow){
  if(!button || !input){
    return
  }

  input.type = shouldShow ? "text" : "password"
  button.setAttribute("aria-pressed", shouldShow ? "true" : "false")
  button.setAttribute("aria-label", shouldShow ? "Hide password" : "Show password")
  button.innerHTML = `<i class="fa-solid ${shouldShow ? "fa-eye-slash" : "fa-eye"}"></i>`
}

function initializePasswordVisibilityToggles(){
  const toggleButtons = document.querySelectorAll("[data-password-toggle-target]")

  toggleButtons.forEach((button) => {
    const targetId = button.getAttribute("data-password-toggle-target")
    const input = targetId ? document.getElementById(targetId) : null

    if(!input){
      return
    }

    syncPasswordVisibilityToggle(button, input, false)

    button.addEventListener("click", () => {
      const shouldShow = input.type === "password"
      syncPasswordVisibilityToggle(button, input, shouldShow)
      input.focus({ preventScroll: true })
    })
  })
}
const addDepartmentBtn = document.getElementById("addDepartmentBtn")
const editDepartmentBtn = document.getElementById("editDepartmentBtn")
const departmentSearch = document.getElementById("departmentSearch")
const departmentModal = document.getElementById("departmentModal")
const departmentProfileWindow = document.getElementById("departmentProfileWindow")
const departmentModalTitle = document.getElementById("departmentModalTitle")
const departmentSaveButton = document.getElementById("departmentSaveButton")
const departmentDeleteButton = document.getElementById("departmentDeleteButton")
const departmentNameInput = document.getElementById("departmentNameInput")
const departmentNotesInput = document.getElementById("departmentNotesInput")
const departmentAvatarPreview = document.getElementById("departmentAvatarPreview")
const departmentIconLibrary = document.getElementById("departmentIconLibrary")
const departmentProfileName = document.getElementById("departmentProfileName")
const departmentMembersBody = document.getElementById("departmentMembersBody")
const printDepartmentButton = document.getElementById("printDepartmentButton")
const assignHodButton = document.getElementById("assignHodButton")
const assignRoleSelect = document.getElementById("assignRoleSelect")
const addDepartmentMemberButton = document.getElementById("addDepartmentMemberButton")
const departmentDeleteConfirmWindow = document.getElementById("departmentDeleteConfirmWindow")
const confirmDepartmentDeleteButton = document.getElementById("confirmDepartmentDeleteButton")
const cancelDepartmentDeleteButton = document.getElementById("cancelDepartmentDeleteButton")
const contractTableBody = document.getElementById("contractTableBody")
const addContractBtn = document.getElementById("addContractBtn")
const editContractBtn = document.getElementById("editContractBtn")
const deleteContractBtn = document.getElementById("deleteContractBtn")
const contractSearchInput = document.getElementById("contractSearchInput")
const contractTypeFilter = document.getElementById("contractTypeFilter")
const contractStartFilter = document.getElementById("contractStartFilter")
const contractStatusFilter = document.getElementById("contractStatusFilter")
const contractSortFilter = document.getElementById("contractSortFilter")
const contractModal = document.getElementById("contractModal")
const contractProfileWindow = document.getElementById("contractProfileWindow")
const contractModalTitle = document.getElementById("contractModalTitle")
const contractNameInput = document.getElementById("contractNameInput")
const contractNumberInput = document.getElementById("contractNumberInput")
const contractAccountNumberInput = document.getElementById("contractAccountNumberInput")
const contractAccountDetailsInput = document.getElementById("contractAccountDetailsInput")
const contractCompanyInput = document.getElementById("contractCompanyInput")
const contractRoleInput = document.getElementById("contractRoleInput")
const contractDateInput = document.getElementById("contractDateInput")
const contractTypeInput = document.getElementById("contractTypeInput")
const contractPaymentInput = document.getElementById("contractPaymentInput")
const contractDocumentsInput = document.getElementById("contractDocumentsInput")
const contractDocumentsPreview = document.getElementById("contractDocumentsPreview")
const contractStatusActions = document.getElementById("contractStatusActions")
const contractSaveButton = document.getElementById("contractSaveButton")
const profileContractName = document.getElementById("profileContractName")
const profileContractNumber = document.getElementById("profileContractNumber")
const profileContractAccountNumber = document.getElementById("profileContractAccountNumber")
const profileContractAccountDetails = document.getElementById("profileContractAccountDetails")
const profileContractCompany = document.getElementById("profileContractCompany")
const profileContractRole = document.getElementById("profileContractRole")
const profileContractDate = document.getElementById("profileContractDate")
const profileContractType = document.getElementById("profileContractType")
const profileContractPayment = document.getElementById("profileContractPayment")
const profileContractBalance = document.getElementById("profileContractBalance")
const contractPaymentHistoryBody = document.getElementById("contractPaymentHistoryBody")
const contractDocumentsGrid = document.getElementById("contractDocumentsGrid")
const payrollSalaryType = document.getElementById("payrollSalaryType")
const payrollDueSelect = document.getElementById("payrollDueSelect")
const payrollDepartmentFilter = document.getElementById("payrollDepartmentFilter")
const payrollTablesArea = document.getElementById("payrollTablesArea")
const payrollHistorySelect = document.getElementById("payrollHistorySelect")
const payrollHistoryArea = document.getElementById("payrollHistoryArea")
const payrollApprovals = document.getElementById("payrollApprovals")
const printPayrollPdfButton = document.getElementById("printPayrollPdfButton")
const payrollCalendarDue = document.getElementById("payrollCalendarDue")
const calendarSalaryType = document.getElementById("calendarSalaryType")
const calendarYearLabel = document.getElementById("calendarYearLabel")
const paydayCalendarGrid = document.getElementById("paydayCalendarGrid")
const paydayDaySelect = document.getElementById("paydayDaySelect")
const paydayMonthSelect = document.getElementById("paydayMonthSelect")
const setPaydayButton = document.getElementById("setPaydayButton")
const calendarApprovals = document.getElementById("calendarApprovals")
const sendPayrollReminderButton = document.getElementById("sendPayrollReminderButton")
const calendarNextPayday = document.getElementById("calendarNextPayday")
const calendarReminderStatus = document.getElementById("calendarReminderStatus")
const calendarCutoffStatus = document.getElementById("calendarCutoffStatus")
const attendanceTableBody = document.getElementById("attendanceTableBody")
const attendanceViewMode = document.getElementById("attendanceViewMode")
const attendanceDateFilterMode = document.getElementById("attendanceDateFilterMode")
const attendanceDateInput = document.getElementById("attendanceDateInput")
const attendanceFromInput = document.getElementById("attendanceFromInput")
const attendanceToInput = document.getElementById("attendanceToInput")
const attendanceMonthInput = document.getElementById("attendanceMonthInput")
const attendanceDateFieldLabel = document.getElementById("attendanceDateFieldLabel")
const attendanceFromFieldLabel = document.getElementById("attendanceFromFieldLabel")
const attendanceToFieldLabel = document.getElementById("attendanceToFieldLabel")
const attendanceMonthFieldLabel = document.getElementById("attendanceMonthFieldLabel")
const attendanceDepartmentFilter = document.getElementById("attendanceDepartmentFilter")
const attendanceExportButton = document.getElementById("attendanceExportButton")
const attendanceEntriesTableBody = document.getElementById("attendanceEntriesTableBody")
const attendanceEmployeeSearch = document.getElementById("attendanceEmployeeSearch")
const attendanceEmployeeSelect = document.getElementById("attendanceEmployeeSelect")
const attendanceEntryDate = document.getElementById("attendanceEntryDate")
const attendanceCheckIn = document.getElementById("attendanceCheckIn")
const attendanceCheckOut = document.getElementById("attendanceCheckOut")
const saveAttendanceEntryButton = document.getElementById("saveAttendanceEntryButton")
const attendanceSummaryText = document.getElementById("attendanceSummaryText")
const attendanceTrackedPeriod = document.getElementById("attendanceTrackedPeriod")
const attendanceEntrySummary = document.getElementById("attendanceEntrySummary")
const attendanceApprovalList = document.getElementById("attendanceApprovalList")
const attendanceRefreshButton = document.getElementById("attendanceRefreshButton")
const activeLeaveCount = document.getElementById("activeLeaveCount")
const pendingLeaveCount = document.getElementById("pendingLeaveCount")
const leaveReturnDue = document.getElementById("leaveReturnDue")
const leaveEmployeeSelect = document.getElementById("leaveEmployeeSelect")
const leaveTypeInput = document.getElementById("leaveTypeInput")
const leaveFromInput = document.getElementById("leaveFromInput")
const leaveToInput = document.getElementById("leaveToInput")
const addLeaveRequestButton = document.getElementById("addLeaveRequestButton")
const activeLeaveTableBody = document.getElementById("activeLeaveTableBody")
const pendingLeaveTableBody = document.getElementById("pendingLeaveTableBody")
const selectedLeaveSummary = document.getElementById("selectedLeaveSummary")
const leaveApprovalList = document.getElementById("leaveApprovalList")
const rejectLeaveButton = document.getElementById("rejectLeaveButton")
const overtimeRatesBody = document.getElementById("overtimeRatesBody")
const overtimeDepartmentInput = document.getElementById("overtimeDepartmentInput")
const overtimeRoleInput = document.getElementById("overtimeRoleInput")
const overtimeRateInput = document.getElementById("overtimeRateInput")
const saveOvertimeRateButton = document.getElementById("saveOvertimeRateButton")
const deleteOvertimeRateButton = document.getElementById("deleteOvertimeRateButton")
const overtimeHint = document.getElementById("overtimeHint")
const companyHolidayBody = document.getElementById("companyHolidayBody")
const nationalHolidayBody = document.getElementById("nationalHolidayBody")
const companyHolidayNameInput = document.getElementById("companyHolidayNameInput")
const companyHolidayDateInput = document.getElementById("companyHolidayDateInput")
const addCompanyHolidayButton = document.getElementById("addCompanyHolidayButton")
const deleteCompanyHolidayButton = document.getElementById("deleteCompanyHolidayButton")
const nationalHolidayNameInput = document.getElementById("nationalHolidayNameInput")
const nationalHolidayDateInput = document.getElementById("nationalHolidayDateInput")
const addNationalHolidayButton = document.getElementById("addNationalHolidayButton")
const deleteNationalHolidayButton = document.getElementById("deleteNationalHolidayButton")
const holidaySummaryText = document.getElementById("holidaySummaryText")
const insightsAnalyticsFilter = document.getElementById("insightsAnalyticsFilter")
const insightsMetricsGrid = document.getElementById("insightsMetricsGrid")
const insightsDepartmentTableBody = document.getElementById("insightsDepartmentTableBody")
const insightsRiskWatch = document.getElementById("insightsRiskWatch")
const insightsReadinessText = document.getElementById("insightsReadinessText")
const insightsDecisionFocus = document.getElementById("insightsDecisionFocus")
const aiInsightsCards = document.getElementById("aiInsightsCards")
const aiInsightsSummary = document.getElementById("aiInsightsSummary")
const aiRecommendedAction = document.getElementById("aiRecommendedAction")
const financialPayeBandsList = document.getElementById("financialPayeBandsList")
const financialPayeReliefAmount = document.getElementById("financialPayeReliefAmount")
const financialShifRule = document.getElementById("financialShifRule")
const financialNssfRule = document.getElementById("financialNssfRule")
const financialHousingLevyRule = document.getElementById("financialHousingLevyRule")
const customDeductionList = document.getElementById("customDeductionList")
const customDeductionName = document.getElementById("customDeductionName")
const customDeductionType = document.getElementById("customDeductionType")
const customDeductionValue = document.getElementById("customDeductionValue")
const addCustomDeductionButton = document.getElementById("addCustomDeductionButton")
const financialRulesSummary = document.getElementById("financialRulesSummary")
const financialEmployeeSearch = document.getElementById("financialEmployeeSearch")
const financialEmployeeSelect = document.getElementById("financialEmployeeSelect")
const financialEmployeeApplyTaxButton = document.getElementById("financialEmployeeApplyTaxButton")
const financialEmployeeTaxOptions = document.getElementById("financialEmployeeTaxOptions")
const financialEmployeeApplyPaye = document.getElementById("financialEmployeeApplyPaye")
const financialEmployeeApplyShif = document.getElementById("financialEmployeeApplyShif")
const financialEmployeeApplyNssf = document.getElementById("financialEmployeeApplyNssf")
const financialEmployeeApplyHousingLevy = document.getElementById("financialEmployeeApplyHousingLevy")
const saveFinancialEmployeeRulesButton = document.getElementById("saveFinancialEmployeeRulesButton")
const financialEmployeeRuleSummary = document.getElementById("financialEmployeeRuleSummary")
const financialIncentivesBody = document.getElementById("financialIncentivesBody")
const financialIncentiveName = document.getElementById("financialIncentiveName")
const financialIncentiveType = document.getElementById("financialIncentiveType")
const financialIncentiveScope = document.getElementById("financialIncentiveScope")
const financialIncentiveTarget = document.getElementById("financialIncentiveTarget")
const financialIncentiveAmount = document.getElementById("financialIncentiveAmount")
const financialIncentiveTaxable = document.getElementById("financialIncentiveTaxable")
const addFinancialIncentiveButton = document.getElementById("addFinancialIncentiveButton")
const financialIncentiveSummary = document.getElementById("financialIncentiveSummary")
const financialReportDepartment = document.getElementById("financialReportDepartment")
const financialReportMetrics = document.getElementById("financialReportMetrics")
const financialTaxReportBody = document.getElementById("financialTaxReportBody")
const financialTaxSummary = document.getElementById("financialTaxSummary")
const financialComplianceText = document.getElementById("financialComplianceText")
const financialLedgerMetrics = document.getElementById("financialLedgerMetrics")
const financialLedgerBody = document.getElementById("financialLedgerBody")
const financialLedgerNarrative = document.getElementById("financialLedgerNarrative")
const payeCalculatorGrossSalary = document.getElementById("payeCalculatorGrossSalary")
const calculatePayeButton = document.getElementById("calculatePayeButton")
const payeCalculatorMessage = document.getElementById("payeCalculatorMessage")
const payeCalculatorResults = document.getElementById("payeCalculatorResults")
const payeHelpers = globalThis.HexaPayPaye || null
const statutoryHelpers = globalThis.HexaPayStatutory || null
const fallbackPayeConfiguration = Object.freeze({
  payeBands: Object.freeze([
    Object.freeze({ upTo: 24000, rate: 0.10 }),
    Object.freeze({ upTo: 32333, rate: 0.25 }),
    Object.freeze({ upTo: 500000, rate: 0.30 }),
    Object.freeze({ upTo: 800000, rate: 0.325 }),
    Object.freeze({ upTo: Infinity, rate: 0.35 })
  ]),
  personalRelief: 2400
})
const fallbackStatutoryConfiguration = Object.freeze({
  paye: fallbackPayeConfiguration,
  shif: Object.freeze({
    employeeRate: 0.0275,
    minimumContribution: 300
  }),
  nssf: Object.freeze({
    employeeRate: 0.06,
    lowerEarningsLimit: 8000,
    upperEarningsLimit: 108000
  }),
  housingLevy: Object.freeze({
    employeeRate: 0.015
  })
})

function clonePayeBands(bands = []){
  return bands.map((band) => ({
    upTo: band.upTo,
    rate: band.rate
  }))
}

function getDefaultPayeConfiguration(){
  const baseConfig = payeHelpers?.DEFAULT_PAYE_CONFIGURATION || fallbackPayeConfiguration
  return {
    payeBands: clonePayeBands(baseConfig.payeBands),
    personalRelief: Number(baseConfig.personalRelief || 0)
  }
}

function normalizePayeConfiguration(config = {}){
  if(payeHelpers?.normalizePayeConfiguration){
    return payeHelpers.normalizePayeConfiguration(config)
  }

  return getDefaultPayeConfiguration()
}

function calculatePAYEAmount(taxablePay, config = {}){
  if(payeHelpers?.calculatePAYE){
    return payeHelpers.calculatePAYE(taxablePay, config)
  }

  return 0
}
function getDefaultStatutoryConfiguration(){
  const baseConfig = statutoryHelpers?.DEFAULT_STATUTORY_CONFIGURATION || fallbackStatutoryConfiguration
  return {
    paye: {
      payeBands: clonePayeBands(baseConfig.paye?.payeBands || fallbackPayeConfiguration.payeBands),
      personalRelief: Number(baseConfig.paye?.personalRelief || fallbackPayeConfiguration.personalRelief)
    },
    shif: {
      employeeRate: Number(baseConfig.shif?.employeeRate || fallbackStatutoryConfiguration.shif.employeeRate),
      minimumContribution: Number(baseConfig.shif?.minimumContribution || fallbackStatutoryConfiguration.shif.minimumContribution)
    },
    nssf: {
      employeeRate: Number(baseConfig.nssf?.employeeRate || fallbackStatutoryConfiguration.nssf.employeeRate),
      lowerEarningsLimit: Number(baseConfig.nssf?.lowerEarningsLimit || fallbackStatutoryConfiguration.nssf.lowerEarningsLimit),
      upperEarningsLimit: Number(baseConfig.nssf?.upperEarningsLimit || fallbackStatutoryConfiguration.nssf.upperEarningsLimit)
    },
    housingLevy: {
      employeeRate: Number(baseConfig.housingLevy?.employeeRate || fallbackStatutoryConfiguration.housingLevy.employeeRate)
    }
  }
}

function normalizeStatutoryConfiguration(config = {}){
  if(statutoryHelpers?.normalizeStatutoryConfiguration){
    return statutoryHelpers.normalizeStatutoryConfiguration(config)
  }

  return getDefaultStatutoryConfiguration()
}

function calculatePayrollPreviewFromConfig(payload = {}){
  if(statutoryHelpers?.calculatePayrollPreview){
    return statutoryHelpers.calculatePayrollPreview(payload)
  }

  return {
    grossSalary: Number(payload.grossSalary || 0),
    taxablePay: Number(payload.grossSalary || 0),
    rawTaxablePay: Number(payload.grossSalary || 0),
    deductions: {
      paye: 0,
      shif: 0,
      nssf: 0,
      housingLevy: 0,
      customDeductions: 0,
      totalEmployeeDeductions: 0
    },
    netPay: Number(payload.grossSalary || 0),
    incomeItems: []
  }
}

function validateGrossSalaryInputValue(value){
  if(statutoryHelpers?.validateGrossSalaryInput){
    return statutoryHelpers.validateGrossSalaryInput(value)
  }

  return ""
}
const recentActivitiesList = document.getElementById("recentActivitiesList")
const upcomingActionsList = document.getElementById("upcomingActionsList")
const overviewSummaryMetrics = document.getElementById("overviewSummaryMetrics")
const structureSalaryType = document.getElementById("structureSalaryType")
const structureDepartmentFilter = document.getElementById("structureDepartmentFilter")
const structureEmployeeSearch = document.getElementById("structureEmployeeSearch")
const structureEmployeeName = document.getElementById("structureEmployeeName")
const structureEmployeeId = document.getElementById("structureEmployeeId")
const structureEmployeeRole = document.getElementById("structureEmployeeRole")
const structureDeductionType = document.getElementById("structureDeductionType")
const structureDeductionAmount = document.getElementById("structureDeductionAmount")
const structureLoanDetails = document.getElementById("structureLoanDetails")
const structureLoanInstallment = document.getElementById("structureLoanInstallment")
const structureLoanInstallments = document.getElementById("structureLoanInstallments")
const structureLoanPaidInstallments = document.getElementById("structureLoanPaidInstallments")
const structureLoanNextDate = document.getElementById("structureLoanNextDate")
const structureAllowanceTaxable = document.getElementById("structureAllowanceTaxable")
const addDeductionButton = document.getElementById("addDeductionButton")
const structureAllowanceType = document.getElementById("structureAllowanceType")
const structureAllowanceAmount = document.getElementById("structureAllowanceAmount")
const addAllowanceButton = document.getElementById("addAllowanceButton")
const structureAdvancePanel = document.getElementById("structureAdvancePanel")
const structureBonusPanel = document.getElementById("structureBonusPanel")
const structureChangesList = document.getElementById("structureChangesList")
const structureApprovals = document.getElementById("structureApprovals")
const printStructurePdfButton = document.getElementById("printStructurePdfButton")

const LEGACY_SETTINGS_STORAGE_KEY = "hexapay-settings"
const UI_PREFERENCES_STORAGE_KEY = "hexapay-ui-preferences"
const EXCHANGE_RATE_STORAGE_KEY = "hexapay-exchange-rates"
const BASE_CURRENCY = "KES"
const LIVE_BACKEND_SYNC_INTERVAL_MS = 5000
const defaultInsightsState = {
  activeTab: "analyticsTab",
  analyticsFilter: "all",
  decisionFocus: "all"
}
const defaultCompanyProfile = {
  id: "local-company",
  name: "",
  industry: "",
  email: "",
  logoUrl: "",
  currency: "KES"
}
const defaultCompanies = [
  {
    id: "local-company",
    name: "",
    industry: "",
    email: "",
    logoUrl: "",
    currency: "KES"
  }
]
const defaultMembers = []
const defaultAppearanceSettings = {
  theme: "system",
  fontScale: 100
}
const defaultActivityHistory = [
  { title: "Dashboard ready", detail: "HexaPay workspace loaded successfully." }
]
const defaultDepartments = []
const defaultContracts = []
const defaultPayrollWorkspace = {
  activeTab: "payrollRun",
  currentRunId: null,
  salaryType: "Monthly",
  due: getCurrentPayrollMonthKey(),
  department: "",
  forceRegenerate: false,
  historyView: "monthly",
  historyRunId: "",
  calendarSalaryType: "Monthly",
  paydayDay: getTomorrowDateKey().slice(8, 10).replace(/^0/, "") || "1",
  paydayMonth: getTomorrowDateKey().slice(0, 7),
  calendarDraftDirty: false,
  structureSalaryType: "Monthly",
  structureDepartment: "",
  structureEmployeeSearch: "",
  approvals: [],
  structureApprovals: [],
  calendarApprovals: [],
  structureChanges: []
}
const defaultWorktrackState = {
    activeTab: "attendanceTab",
    attendanceView: "daily",
    attendanceDateFilterMode: "current_period",
    attendanceDate: new Date().toISOString().slice(0, 10),
    attendanceFrom: new Date().toISOString().slice(0, 10),
    attendanceTo: new Date().toISOString().slice(0, 10),
    attendanceMonth: new Date().toISOString().slice(0, 7),
    attendanceDepartmentId: "",
    attendanceLogs: [],
    leaveRequests: [],
    overtimeRates: [],
    companyHolidays: [],
    nationalHolidays: []
}
const defaultWorktrackUiState = {
    activeTab: defaultWorktrackState.activeTab,
    attendanceView: defaultWorktrackState.attendanceView,
    attendanceDateFilterMode: defaultWorktrackState.attendanceDateFilterMode,
    attendanceDate: defaultWorktrackState.attendanceDate,
    attendanceFrom: defaultWorktrackState.attendanceFrom,
    attendanceTo: defaultWorktrackState.attendanceTo,
    attendanceMonth: defaultWorktrackState.attendanceMonth,
    attendanceDepartmentId: defaultWorktrackState.attendanceDepartmentId,
    overtimeRates: structuredClone(defaultWorktrackState.overtimeRates)
}
const defaultFinancialsState = {
    activeTab: "financialRulesTab",
    reportDepartment: "",
    employeeSearch: "",
    selectedEmployeeId: "",
    statutory: {
      ...getDefaultStatutoryConfiguration(),
      backendRuleIds: {}
    },
    calculator: {
      grossSalary: "",
      result: null,
      validationMessage: ""
    },
    customDeductions: [],
    incentives: []
  }

const financialRuleSyncState = {
  companyId: "",
  inFlight: null
}

const overviewSyncState = {
  companyId: "",
  inFlight: null
}

const salaryHistoryLoadState = new Map()

const contractSyncState = {
  companyId: "",
  inFlight: null
}

const holidaySyncState = {
  companyId: "",
  inFlight: null
}

const overtimeSyncState = {
  companyId: "",
  inFlight: null
}

let liveBackendSyncTimer = null
let liveBackendSyncInFlight = null

function resetBackendDrivenViewSyncState(){
  overviewSyncState.companyId = ""
  overviewSyncState.inFlight = null
  financialRuleSyncState.companyId = ""
  financialRuleSyncState.inFlight = null
  contractSyncState.companyId = ""
  contractSyncState.inFlight = null
  holidaySyncState.companyId = ""
  holidaySyncState.inFlight = null
  overtimeSyncState.companyId = ""
  overtimeSyncState.inFlight = null
}

let latestPayrollStructureState = null
let latestPayrollCalendarState = null

let selectedCompanyLogo = ""
let selectedSignupCompanyLogo = ""
function createUserModel({
  id,
  email,
  displayName,
  title = "",
  role,
  avatarUrl = "",
  status = "active"
}){
  return { id, email, displayName, title, role, avatarUrl, status }
}

function createCompanyModel({
  id,
  name,
  industry,
  email,
  currency,
  logoUrl = "Assets/Logo.png"
}){
  return { id, name, industry, email, currency, logoUrl }
}

function createCompanyMembershipModel({
  id,
  companyId,
  userId,
  role,
  status = "active"
}){
  return { id, companyId, userId, role, status }
}

function createDepartmentModel({
  id,
  companyId,
  name,
  roles,
  salaryType,
  defaultSalary,
  employeeCount = 0,
  headOfDepartmentEmployeeId = "",
  hod = "",
  notes = "",
  icon = "fa-building"
}){
  return {
    id,
    companyId,
    name,
    roles,
    salaryType,
    defaultSalary,
    salary: defaultSalary,
    employeeCount,
    headOfDepartmentEmployeeId,
    hod,
    notes,
    icon
  }
}

function createEmployeeLoanProfile(overrides = {}){
  const totalInstallments = Number(overrides.totalInstallments || 0)
  const installmentsPaid = Number(overrides.installmentsPaid || 0)
  const installmentsRemaining = overrides.installmentsRemaining !== undefined
    ? Number(overrides.installmentsRemaining || 0)
    : Math.max(0, totalInstallments - installmentsPaid)

  return {
    enabled: Boolean(overrides.enabled),
    name: overrides.name || "",
    principalAmount: Number(overrides.principalAmount || 0),
    balanceAmount: Number(overrides.balanceAmount || 0),
    installmentAmount: Number(overrides.installmentAmount || 0),
    installmentFrequency: String(overrides.installmentFrequency || "Monthly"),
    totalInstallments,
    installmentsPaid,
    installmentsRemaining,
    nextDeductionDate: overrides.nextDeductionDate || ""
  }
}

function createEmployeeFinancialProfile(overrides = {}){
  const statutory = overrides.statutory || {}
  return {
    applyTaxFinancials: Boolean(overrides.applyTaxFinancials),
    statutory: {
      paye: statutory.paye !== false,
      shif: statutory.shif !== false && statutory.insurance !== false,
      nssf: statutory.nssf !== false && statutory.pension !== false,
      housingLevy: statutory.housingLevy !== false
    },
    loan: createEmployeeLoanProfile(overrides.loan || {})
  }
}

function createEmployeeModel({
  id,
  companyId,
  departmentId,
  employeeNumber = "",
  fullName,
  identificationNumber,
  accountNumber,
  accountDetails,
  roleTitle,
  employmentType,
  paymentType,
  paymentBasis = "standard",
  employmentDate,
  salaryAmount,
  status,
  payrollStatus,
  profileImage = "",
  unpaidBalance = 0,
  documents = [],
  salaryHistory = [],
  financialProfile = createEmployeeFinancialProfile()
}){
  return {
    id,
    companyId,
    departmentId,
    employeeNumber,
    fullName,
    identificationNumber,
    accountNumber,
    accountDetails,
    roleTitle,
    employmentType,
    paymentType: paymentType || employmentType || "Monthly",
    paymentBasis,
    employmentDate,
    salaryAmount,
    status,
    payrollStatus,
    profileImage,
    unpaidBalance,
    documents,
    salaryHistory,
    financialProfile: createEmployeeFinancialProfile(financialProfile)
  }
}

function createPayrollItemModel({
  id,
  runId,
  companyId,
  employeeId,
  departmentId,
  period,
  salaryType,
  attendanceDays = 0,
  baseSalary,
  grossPay = baseSalary,
  taxablePay = baseSalary,
  payeTaxableBase = taxablePay,
  deductions,
  allowances,
  netPay,
  approvalStatus = "pending",
  signed = false,
  paid = signed,
  paidAt = null,
  paidByUserId = "",
  breakdown = {},
  allowanceBreakdown = [],
  deductionBreakdown = [],
  statutoryDeductionsTotal = 0,
  structureAllowancesTotal = 0,
  structureDeductionsTotal = 0,
  financialRuleAllowancesTotal = 0,
  financialRuleDeductionsTotal = 0,
  loanDeductionsTotal = 0
}){ 
  return {
    id,
    runId,
    companyId,
    employeeId,
    departmentId,
    period,
    salaryType,
    attendanceDays,
    baseSalary,
    grossPay,
    taxablePay,
    payeTaxableBase,
    deductions,
    allowances,
    netPay,
    approvalStatus,
    signed,
    paid,
    paidAt,
    paidByUserId,
    breakdown,
    allowanceBreakdown,
    deductionBreakdown,
    statutoryDeductionsTotal,
    structureAllowancesTotal,
    structureDeductionsTotal,
    financialRuleAllowancesTotal,
    financialRuleDeductionsTotal,
    loanDeductionsTotal
  }
}

function createPayrollRunModel({
  id,
  companyId,
  period,
  salaryType,
  departmentScope = "",
  status = "draft",
  approvals = [],
  itemIds = [],
  itemCount = itemIds.length,
  paidItemCount = 0,
  unpaidItemCount = itemCount,
  lastPaidAt = null,
  generatedByUserId = "",
  currencyCode = BASE_CURRENCY,
  totals = {
    baseSalary: 0,
    deductions: 0,
    allowances: 0,
    netPay: 0
  },
  generatedAt = new Date().toISOString()
}){
  return {
    id,
    companyId,
    period,
    salaryType,
    departmentScope,
    status,
    approvals,
    itemIds,
    itemCount,
    paidItemCount,
    unpaidItemCount,
    lastPaidAt,
    generatedByUserId,
    currencyCode,
    totals,
    generatedAt
  }
}

function createContractModel({
  id,
  companyId,
  employeeId = "",
  partyName,
  companyName,
  contractNumber,
  accountNumber,
  accountDetails,
  roleTitle,
  contractDate,
  contractType,
  totalPayment,
  status = "Active",
  balance = 0,
  documents = [],
  paymentHistory = []
}){
  return {
    id,
    companyId,
    employeeId,
    partyName,
    companyName,
    contractNumber,
    accountNumber,
    accountDetails,
    roleTitle,
    contractDate,
    contractType,
    totalPayment,
    status,
    balance,
    documents,
    paymentHistory,
    name: partyName,
    company: companyName,
    role: roleTitle,
    date: contractDate,
    type: contractType
  }
}

function createAttendanceLogModel({
  id,
  companyId,
  employeeId,
  employeeName,
  departmentId,
  departmentName,
  roleTitle,
  date,
  checkIn,
  checkOut,
  mode = "Manual",
  approvals = []
}){
  return {
    id,
    companyId,
    employeeId,
    employeeName,
    departmentId,
    departmentName,
    roleTitle,
    date,
    checkIn,
    checkOut,
    mode,
    approvals,
    employee: employeeName,
    department: departmentName,
    role: roleTitle
  }
}

function createLeaveRequestModel({
  id,
  companyId,
  employeeId,
  employeeName,
  leaveType,
  departmentId,
  departmentName,
  fromDate,
  toDate,
  requestedDate,
  status = "Pending",
  approvals = []
}){
  return {
    id,
    companyId,
    employeeId,
    employeeName,
    leaveType,
    departmentId,
    departmentName,
    fromDate,
    toDate,
    requestedDate,
    status,
    approvals,
    employee: employeeName,
    type: leaveType,
    department: departmentName,
    from: fromDate,
    to: toDate,
    requested: requestedDate
  }
}

function createHolidayModel({
  id,
  companyId,
  scope,
  name,
  date
}){
  return { id, companyId, scope, name, date }
}

const exampleCompanyModels = [
  createCompanyModel({
    id: "local-company",
    name: "",
    industry: "",
    email: "",
    currency: "KES",
    logoUrl: ""
  })
]

const exampleUserModels = []

const exampleCompanyMemberships = []

const exampleDepartmentModels = defaultDepartments.map((department) => createDepartmentModel({
  id: department.id,
  companyId: "company-a",
  name: department.name,
  roles: department.roles,
  salaryType: department.salaryType,
  defaultSalary: department.salary,
  employeeCount: department.employeeCount,
  hod: department.hod,
  notes: department.notes,
  icon: department.icon
}))

function findDepartmentIdByName(name){
  return exampleDepartmentModels.find((department) => department.name.toLowerCase() === name.toLowerCase())?.id || ""
}

const exampleEmployeeModels = [
  createEmployeeModel({
    id: "emp-john-doe",
    companyId: "company-a",
    departmentId: findDepartmentIdByName("ENGINEERING"),
    fullName: "John Doe",
    identificationNumber: "ID-481239",
    accountNumber: "01124567",
    accountDetails: "KCB Bank",
    roleTitle: "Software Engineer",
    employmentType: "Full Time",
    employmentDate: "2022-03-15",
    salaryAmount: 185000,
    status: "ACTIVE",
    payrollStatus: "processed",
    documents: ["National ID.pdf", "NSSF Form.pdf", "Contract.pdf"],
    salaryHistory: createSalaryHistory(185000)
  }),
  createEmployeeModel({
    id: "emp-sarah-kim",
    companyId: "company-a",
    departmentId: findDepartmentIdByName("S&M"),
    fullName: "Sarah Kim",
    identificationNumber: "ID-582144",
    accountNumber: "01124568",
    accountDetails: "Equity Bank",
    roleTitle: "Sales Coordinator",
    employmentType: "Contract",
    employmentDate: "2023-07-10",
    salaryAmount: 120000,
    status: "RESIGNED",
    payrollStatus: "pending",
    documents: ["National ID.pdf", "NHIF Form.pdf"],
    salaryHistory: createSalaryHistory(120000)
  }),
  createEmployeeModel({
    id: "emp-david-lee",
    companyId: "company-a",
    departmentId: findDepartmentIdByName("HR"),
    fullName: "David Lee",
    identificationNumber: "ID-772951",
    accountNumber: "01124569",
    accountDetails: "NCBA",
    roleTitle: "HR Officer",
    employmentType: "Part Time",
    employmentDate: "2021-11-01",
    salaryAmount: 95000,
    status: "FIRED",
    payrollStatus: "hold",
    documents: ["National ID.pdf", "Contract.pdf"],
    salaryHistory: createSalaryHistory(95000)
  }),
  createEmployeeModel({
    id: "emp-maria-lopez",
    companyId: "company-a",
    departmentId: findDepartmentIdByName("ACCOUNTS"),
    fullName: "Maria Lopez",
    identificationNumber: "ID-913557",
    accountNumber: "01124570",
    accountDetails: "Absa",
    roleTitle: "Finance Analyst",
    employmentType: "Full Time",
    employmentDate: "2019-04-22",
    salaryAmount: 210000,
    status: "RETIRED",
    payrollStatus: "processed",
    unpaidBalance: 8000,
    documents: ["National ID.pdf", "Pension Form.pdf"],
    salaryHistory: createSalaryHistory(210000)
  })
]

const examplePayrollItemModels = exampleEmployeeModels.map((employee) => {
  const latestHistory = employee.salaryHistory.at(-1)
  const baseSalary = latestHistory?.gross || employee.salaryAmount
  const deductions = latestHistory?.deductions || Math.round(baseSalary * 0.15)
  const allowances = latestHistory?.allowance || 12000
  return createPayrollItemModel({
    id: `payitem-${employee.id}-2026-03`,
    runId: "payrun-company-a-2026-03-monthly-all",
    companyId: employee.companyId,
    employeeId: employee.id,
    departmentId: employee.departmentId,
    period: "2026-03",
    salaryType: "Monthly",
    attendanceDays: 0,
    baseSalary,
    deductions,
    allowances,
    netPay: baseSalary - deductions + allowances,
    approvalStatus: employee.status === "ACTIVE" ? "pending" : "hold"
  })
})

const examplePayrollRunModels = [
  createPayrollRunModel({
    id: "payrun-company-a-2026-03-monthly-all",
    companyId: "company-a",
    period: "2026-03",
    salaryType: "Monthly",
    departmentScope: "",
    itemIds: examplePayrollItemModels.map((item) => item.id),
    totals: examplePayrollItemModels.reduce((accumulator, item) => {
      accumulator.baseSalary += Number(item.baseSalary || 0)
      accumulator.deductions += Number(item.deductions || 0)
      accumulator.allowances += Number(item.allowances || 0)
      accumulator.netPay += Number(item.netPay || 0)
      return accumulator
    }, {
      baseSalary: 0,
      deductions: 0,
      allowances: 0,
      netPay: 0
    })
  })
]

const exampleContractModels = defaultContracts.map((contract) => createContractModel({
  id: contract.id,
  companyId: "company-a",
  employeeId: exampleEmployeeModels.find((employee) => employee.fullName === contract.name)?.id || "",
  partyName: contract.name,
  companyName: contract.company,
  contractNumber: contract.contractNumber,
  accountNumber: contract.accountNumber,
  accountDetails: contract.accountDetails,
  roleTitle: contract.role,
  contractDate: contract.date,
  contractType: contract.type,
  totalPayment: contract.totalPayment,
  status: contract.status,
  balance: contract.balance,
  documents: contract.documents,
  paymentHistory: contract.paymentHistory
}))

const exampleAttendanceLogModels = defaultWorktrackState.attendanceLogs.map((log) => {
  const employee = exampleEmployeeModels.find((item) => item.fullName === log.employee)
  return createAttendanceLogModel({
    id: log.id,
    companyId: employee?.companyId || "company-a",
    employeeId: employee?.id || "",
    employeeName: log.employee,
    departmentId: employee?.departmentId || "",
    departmentName: log.department,
    roleTitle: log.role,
    date: log.date,
    checkIn: log.checkIn,
    checkOut: log.checkOut,
    mode: log.mode,
    approvals: log.approvals
  })
})

const exampleLeaveRequestModels = defaultWorktrackState.leaveRequests.map((request) => {
  const employee = exampleEmployeeModels.find((item) => item.fullName === request.employee)
  return createLeaveRequestModel({
    id: request.id,
    companyId: employee?.companyId || "company-a",
    employeeId: employee?.id || "",
    employeeName: request.employee,
    leaveType: request.type,
    departmentId: employee?.departmentId || "",
    departmentName: request.department,
    fromDate: request.from,
    toDate: request.to,
    requestedDate: request.requested,
    status: request.status,
    approvals: request.approvals
  })
})

const exampleCompanyHolidayModels = defaultWorktrackState.companyHolidays.map((holiday) => createHolidayModel({
  id: holiday.id,
  companyId: "company-a",
  scope: "company",
  name: holiday.name,
  date: holiday.date
}))

const exampleNationalHolidayModels = defaultWorktrackState.nationalHolidays.map((holiday) => createHolidayModel({
  id: holiday.id,
  companyId: "company-a",
  scope: "national",
  name: holiday.name,
  date: holiday.date
}))

const defaultAppState = {
  auth: {
    users: structuredClone(exampleUserModels),
    currentUserId: null,
    currentUser: null,
    token: null,
    refreshToken: null,
    status: "signed_out",
    availableRoles: ["Admin", "Manager", "Viewer"],
    roleAccess: {
      Admin: ["view", "edit", "approve", "manage"],
      Manager: ["view", "edit", "approve"],
      Viewer: ["view"]
    }
  },
  company: {
    companies: structuredClone(exampleCompanyModels),
    activeCompanyId: "local-company",
    memberships: structuredClone(exampleCompanyMemberships),
    activityHistory: structuredClone(defaultActivityHistory),
    departments: structuredClone(exampleDepartmentModels)
  },
  employees: {
    records: [],
    selectedEmployeeId: null,
    worktrack: structuredClone(defaultWorktrackUiState)
  },
  contracts: {
    records: [],
    selectedContractId: null
  },
  attendance: {
    records: [],
    selectedLogId: null
  },
  leave: {
    records: [],
    selectedRequestId: null
  },
  holidays: {
    companyRecords: [],
    nationalRecords: []
  },
  payroll: {
    runs: [],
    items: [],
    workspace: structuredClone(defaultPayrollWorkspace),
    insights: structuredClone(defaultInsightsState),
    financials: structuredClone(defaultFinancialsState)
  },
  settings: {
    appearance: structuredClone(defaultAppearanceSettings),
    ui: {
      pendingCurrencySelection: null,
      currencyApplyMessage: "",
      profileAuthMessage: "",
      profileAuthMessageTone: "neutral"
    }
  }
}
const defaultSettings = {
  companies: structuredClone(defaultCompanies),
  company: structuredClone(defaultCompanyProfile),
  members: structuredClone(defaultMembers),
  appearance: structuredClone(defaultAppearanceSettings),
  activityHistory: structuredClone(defaultActivityHistory),
  profile: {
    companyEmail: defaultCompanyProfile.email,
    isLoggedIn: false,
    userName: defaultCompanyProfile.name,
    userRole: "Guest"
  },
  departments: structuredClone(defaultDepartments),
  contracts: structuredClone(defaultContracts),
  payroll: structuredClone(defaultPayrollWorkspace),
  worktrack: structuredClone(defaultWorktrackUiState),
  insights: structuredClone(defaultInsightsState),
  financials: structuredClone(defaultFinancialsState)
}

function loadUiPreferences(){
  const savedPreferences = localStorage.getItem(UI_PREFERENCES_STORAGE_KEY)

  if(savedPreferences){
    try{
      return { ...defaultAppearanceSettings, ...JSON.parse(savedPreferences) }
    } catch (error){
      return structuredClone(defaultAppearanceSettings)
    }
  }

  const legacySettings = localStorage.getItem(LEGACY_SETTINGS_STORAGE_KEY)

  if(legacySettings){
    try{
      const parsedLegacy = JSON.parse(legacySettings)
      return { ...defaultAppearanceSettings, ...(parsedLegacy.appearance || {}) }
    } catch (error){
      return structuredClone(defaultAppearanceSettings)
    }
  }

  return structuredClone(defaultAppearanceSettings)
}

function createInitialAppState(){
  const state = structuredClone(defaultAppState)
  state.settings.appearance = loadUiPreferences()
  return state
}

function getActiveCompanyFromState(state){
  return state.company.companies.find((company) => company.id === state.company.activeCompanyId) || state.company.companies[0]
}

function getUserByIdFromState(state, userId){
  return state.auth.users.find((user) => user.id === userId) || null
}

function getCurrentAuthUserFromState(state){
  if(!state.auth.currentUserId){
    return state.auth.currentUser
  }

  return getUserByIdFromState(state, state.auth.currentUserId) || state.auth.currentUser
}

function isAuthenticatedFromState(state){
  return Boolean(state.auth.token && state.auth.currentUserId)
}

function normalizeAuthRole(role){
  const normalizedRole = String(role || "").trim().toLowerCase()

  if(normalizedRole === "admin"){
    return "Admin"
  }

  if(normalizedRole === "manager"){
    return "Manager"
  }

  return "Viewer"
}

function getPasswordRequirementMessage(){
  return "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character."
}

function isStrongPassword(password){
  const value = String(password || "")
  return value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
}

function setProfileAuthMessage(message, tone = "neutral"){
  appState.settings.ui.profileAuthMessage = message || ""
  appState.settings.ui.profileAuthMessageTone = tone
}

function inferAuthRoleFromLabel(label){
  const normalizedLabel = String(label || "").trim().toLowerCase()

  if(normalizedLabel.includes("admin") || normalizedLabel.includes("owner")){
    return "Admin"
  }

  if(normalizedLabel.includes("manager") || normalizedLabel.includes("lead") || normalizedLabel.includes("head")){
    return "Manager"
  }

  return "Viewer"
}

function createMockAuthToken(user, company){
  return `mock-token:${company?.id || "company"}:${user?.id || "user"}:${Date.now().toString(36)}`
}

function syncCurrentAuthUserSnapshot(state){
  const currentUser = getCurrentAuthUserFromState(state)
  state.auth.currentUser = currentUser ? {
    id: currentUser.id,
    email: currentUser.email,
    displayName: currentUser.displayName,
    title: currentUser.title || "",
    role: normalizeAuthRole(currentUser.role),
    avatarUrl: currentUser.avatarUrl || "",
    status: currentUser.status || "active"
  } : null
}

function loginWithMockSession(state, user){
  const activeCompany = getActiveCompanyFromState(state)
  if(!user || !activeCompany){
    return null
  }

  state.auth.currentUserId = user.id
  state.auth.token = createMockAuthToken(user, activeCompany)
  state.auth.status = "signed_in"
  syncCurrentAuthUserSnapshot(state)
  return state.auth.currentUser
}

function logoutMockSession(state){
  state.auth.currentUserId = null
  state.auth.currentUser = null
  state.auth.token = null
  state.auth.refreshToken = null
  state.auth.status = "signed_out"
}

function userHasRoleAccess(state, allowedRoles = []){
  const currentUser = getCurrentAuthUserFromState(state)
  if(!currentUser){
    return false
  }

  if(!allowedRoles.length){
    return true
  }

  return allowedRoles.includes(normalizeAuthRole(currentUser.role))
}

function isCompanyProfileUser(state, user, company = getActiveCompanyFromState(state)){
  if(!user || !company){
    return false
  }

  return String(user.email || "").trim().toLowerCase() === String(company.email || "").trim().toLowerCase()
}

function getCompanyMembersFromState(state){
  const activeCompany = getActiveCompanyFromState(state)
  if(!activeCompany){
    return []
  }

  return state.company.memberships
    .filter((membership) => membership.companyId === activeCompany.id)
    .map((membership) => {
      const user = getUserByIdFromState(state, membership.userId)
      return {
        id: membership.id,
        userId: membership.userId,
        name: user?.displayName || "Unknown User",
        title: user?.title || "",
        role: membership.role,
        email: user?.email || "",
        status: membership.status
      }
    })
    .filter((member) => !isCompanyProfileUser(state, { email: member.email }, activeCompany))
}

const approvalWorkflowConfig = {
  payroll: { maxCount: 3, preferredRoles: ["Admin", "Manager"] },
  structure: { maxCount: 3, preferredRoles: ["Admin", "Manager"] },
  calendar: { maxCount: 2, preferredRoles: ["Admin", "Manager"] },
  attendance: { maxCount: 2, preferredRoles: ["Admin", "Manager"] },
  leave: { maxCount: 2, preferredRoles: ["Admin", "Manager"] }
}

function getApprovalMemberPriority(member){
  const role = normalizeAuthRole(member?.role || "Viewer")
  if(role === "Admin"){
    return 0
  }

  if(role === "Manager"){
    return 1
  }

  return 2
}

function getActiveApprovalMembersFromState(state, workflowType = "payroll"){
  const workflow = approvalWorkflowConfig[workflowType] || approvalWorkflowConfig.payroll
  const members = getCompanyMembersFromState(state)
    .filter((member) => {
      const normalizedStatus = String(member.status || "active").trim().toLowerCase()
      return normalizedStatus !== "removed" && normalizedStatus !== "suspended"
    })
    .map((member) => ({
      ...member,
      role: normalizeAuthRole(member.role)
    }))
    .sort((left, right) => {
      const priorityDelta = getApprovalMemberPriority(left) - getApprovalMemberPriority(right)
      if(priorityDelta !== 0){
        return priorityDelta
      }

      return String(left.name || "").localeCompare(String(right.name || ""))
    })

  let eligibleMembers = members.filter((member) => workflow.preferredRoles.includes(member.role))
  if(!eligibleMembers.length){
    eligibleMembers = members
  }

  if(!eligibleMembers.length){
    const currentUser = getCurrentAuthUserFromState(state)
    if(currentUser && !isCompanyProfileUser(state, currentUser)){
      eligibleMembers = [{
        id: `approval-member-${currentUser.id || "current"}`,
        userId: currentUser.id || "",
        name: currentUser.displayName || "Current User",
        role: normalizeAuthRole(currentUser.role || "Admin"),
        email: currentUser.email || "",
        status: "active"
      }]
    }
  }

  return eligibleMembers.slice(0, workflow.maxCount)
}

function buildWorkflowApprovalTemplates(state, workflowType = "payroll"){
  return getActiveApprovalMembersFromState(state, workflowType).map((member) => ({
    approverId: member.userId || "",
    approverName: member.name,
    approver: member.name,
    role: member.role,
    approved: false,
    status: "pending",
    approvedAt: null,
    rejectedAt: null,
    rejectionReason: ""
  }))
}

function getMergedApprovalStatus(approval){
  if(approval?.status){
    return approval.status
  }

  if(approval?.approved){
    return "approved"
  }

  return "pending"
}

function findMatchingApproval(existingApprovals, template, index){
  return existingApprovals.find((approval, approvalIndex) => {
    if(template.approverId && approval?.approverId && String(template.approverId) === String(approval.approverId)){
      return true
    }

    const approvalName = String(approval?.approverName || approval?.approver || "").trim().toLowerCase()
    const templateName = String(template.approverName || template.approver || "").trim().toLowerCase()
    if(approvalName && templateName && approvalName === templateName){
      return true
    }

    const approvalRole = String(approval?.role || "").trim().toLowerCase()
    const templateRole = String(template.role || "").trim().toLowerCase()
    if(approvalRole && templateRole && approvalRole === templateRole){
      return true
    }

    return approvalIndex === index
  }) || null
}

function mergeApprovalTemplates(existingApprovals = [], templates = []){
  return templates.map((template, index) => {
    const existingApproval = findMatchingApproval(existingApprovals, template, index)
    const status = getMergedApprovalStatus(existingApproval)
    return {
      ...template,
      approved: status === "approved",
      status,
      approvedAt: existingApproval?.approvedAt || null,
      rejectedAt: existingApproval?.rejectedAt || null,
      rejectionReason: existingApproval?.rejectionReason || ""
    }
  })
}

function syncApprovalTemplatesForState(state){
  const activeCompany = getActiveCompanyFromState(state)
  if(!activeCompany){
    return
  }

  const payrollTemplates = buildWorkflowApprovalTemplates(state, "payroll")
  const structureTemplates = buildWorkflowApprovalTemplates(state, "structure")
  const calendarTemplates = buildWorkflowApprovalTemplates(state, "calendar")
  const attendanceTemplates = buildWorkflowApprovalTemplates(state, "attendance")
  const leaveTemplates = buildWorkflowApprovalTemplates(state, "leave")

  state.payroll.workspace.approvals = mergeApprovalTemplates(state.payroll.workspace.approvals, payrollTemplates)
  state.payroll.workspace.structureApprovals = mergeApprovalTemplates(state.payroll.workspace.structureApprovals, structureTemplates)
  state.payroll.workspace.calendarApprovals = mergeApprovalTemplates(state.payroll.workspace.calendarApprovals, calendarTemplates)

  state.payroll.runs = state.payroll.runs.map((run) => {
    if(run.companyId !== activeCompany.id){
      return run
    }

    return {
      ...run,
      approvals: mergeApprovalTemplates(run.approvals, payrollTemplates)
    }
  })

  state.attendance.records = state.attendance.records.map((record) => {
    if(record.companyId !== activeCompany.id){
      return record
    }

    return {
      ...record,
      approvals: mergeApprovalTemplates(record.approvals, attendanceTemplates)
    }
  })

  state.leave.records = state.leave.records.map((record) => {
    if(record.companyId !== activeCompany.id){
      return record
    }

    return {
      ...record,
      approvals: mergeApprovalTemplates(record.approvals, leaveTemplates)
    }
  })
}

function replaceCompanyMembersInState(state, members){
  const activeCompany = getActiveCompanyFromState(state)
  if(!activeCompany){
    return
  }

  state.company.memberships = state.company.memberships.filter((membership) => membership.companyId !== activeCompany.id)

  members.forEach((member, index) => {
    const userId = member.userId || `user-member-${Date.now().toString(36)}-${index}`
    const existingUser = getUserByIdFromState(state, userId)

    if(existingUser){
      existingUser.displayName = member.name
      existingUser.title = member.title || existingUser.title || ""
      existingUser.role = inferAuthRoleFromLabel(member.role)
      existingUser.email = member.email || existingUser.email
    } else {
      state.auth.users.push(createUserModel({
        id: userId,
        email: member.email || `${member.name.toLowerCase().replace(/\s+/g, ".")}@${activeCompany.name.toLowerCase().replace(/\s+/g, "")}.local`,
        displayName: member.name,
        title: member.title || "",
        role: inferAuthRoleFromLabel(member.role)
      }))
    }

    state.company.memberships.push(createCompanyMembershipModel({
      id: member.id || `membership-${Date.now().toString(36)}-${index}`,
      companyId: activeCompany.id,
      userId,
      role: member.role,
      status: member.status || "active"
    }))
  })

  syncApprovalTemplatesForState(state)
}

function createLegacySettingsAdapter(state){
  const legacyProfile = {}
  const legacyWorktrack = {}
  Object.defineProperties(legacyProfile, {
    companyEmail: {
      get(){
        return getActiveCompanyFromState(state)?.email || ""
      },
      set(value){
        const activeCompany = getActiveCompanyFromState(state)
        if(activeCompany){
          activeCompany.email = value
        }
      }
    },
    isLoggedIn: {
      get(){
        return isAuthenticatedFromState(state)
      },
      set(value){
        if(!value){
          logoutMockSession(state)
        }
      }
    },
    userName: {
      get(){
        return getCurrentAuthUserFromState(state)?.displayName || getActiveCompanyFromState(state)?.name || "Guest"
      },
      set(value){
        const currentUser = getCurrentAuthUserFromState(state)
        if(!currentUser){
          return
        }

        currentUser.displayName = value || currentUser.displayName || getActiveCompanyFromState(state)?.name || "Guest"
        syncCurrentAuthUserSnapshot(state)
      }
    },
    userRole: {
      get(){
        return normalizeAuthRole(getCurrentAuthUserFromState(state)?.role || "Member")
      },
      set(value){
        const currentUser = getCurrentAuthUserFromState(state)
        if(!currentUser){
          return
        }

        currentUser.role = normalizeAuthRole(value || currentUser.role)
        syncCurrentAuthUserSnapshot(state)
      }
    }
  })

  Object.defineProperties(legacyWorktrack, {
    activeTab: {
      get(){
        return state.employees.worktrack.activeTab
      },
      set(value){
        state.employees.worktrack.activeTab = value
      }
    },
    attendanceView: {
      get(){
        return state.employees.worktrack.attendanceView
      },
      set(value){
        state.employees.worktrack.attendanceView = value
      }
    },
    attendanceDate: {
      get(){
        return state.employees.worktrack.attendanceDate
      },
      set(value){
        state.employees.worktrack.attendanceDate = value
      }
    },
    attendanceFrom: {
      get(){
        return state.employees.worktrack.attendanceFrom
      },
      set(value){
        state.employees.worktrack.attendanceFrom = value
      }
    },
    attendanceTo: {
      get(){
        return state.employees.worktrack.attendanceTo
      },
      set(value){
        state.employees.worktrack.attendanceTo = value
      }
    },
    attendanceMonth: {
      get(){
        return state.employees.worktrack.attendanceMonth
      },
      set(value){
        state.employees.worktrack.attendanceMonth = value
      }
    },
    attendanceDateFilterMode: {
      get(){
        return state.employees.worktrack.attendanceDateFilterMode
      },
      set(value){
        state.employees.worktrack.attendanceDateFilterMode = value
      }
    },
    attendanceDepartmentId: {
      get(){
        return state.employees.worktrack.attendanceDepartmentId
      },
      set(value){
        state.employees.worktrack.attendanceDepartmentId = value
      }
    },
    attendanceLogs: {
      get(){
        return state.attendance.records
      },
      set(value){
        state.attendance.records = value
      }
    },
    leaveRequests: {
      get(){
        return state.leave.records
      },
      set(value){
        state.leave.records = value
      }
    },
    overtimeRates: {
      get(){
        return state.employees.worktrack.overtimeRates
      },
      set(value){
        state.employees.worktrack.overtimeRates = value
      }
    },
    companyHolidays: {
      get(){
        return state.holidays.companyRecords
      },
      set(value){
        state.holidays.companyRecords = value
      }
    },
    nationalHolidays: {
      get(){
        return state.holidays.nationalRecords
      },
      set(value){
        state.holidays.nationalRecords = value
      }
    }
  })

  const adapter = {}
  Object.defineProperties(adapter, {
    companies: {
      get(){
        return state.company.companies
      },
      set(value){
        state.company.companies = value
      }
    },
    company: {
      get(){
        return getActiveCompanyFromState(state)
      },
      set(value){
        const activeCompany = getActiveCompanyFromState(state)
        if(!activeCompany){
          return
        }
        Object.assign(activeCompany, value)
      }
    },
    members: {
      get(){
        return getCompanyMembersFromState(state)
      },
      set(value){
        replaceCompanyMembersInState(state, value)
      }
    },
    appearance: {
      get(){
        return state.settings.appearance
      },
      set(value){
        state.settings.appearance = { ...state.settings.appearance, ...value }
      }
    },
    activityHistory: {
      get(){
        return state.company.activityHistory
      },
      set(value){
        state.company.activityHistory = value
      }
    },
    profile: {
      get(){
        return legacyProfile
      }
    },
    departments: {
      get(){
        return state.company.departments
      },
      set(value){
        state.company.departments = value
      }
    },
    contracts: {
      get(){
        return state.contracts.records
      },
      set(value){
        state.contracts.records = value
      }
    },
    payroll: {
      get(){
        return state.payroll.workspace
      },
      set(value){
        state.payroll.workspace = { ...state.payroll.workspace, ...value }
      }
    },
    worktrack: {
      get(){
        return legacyWorktrack
      },
      set(value){
        Object.assign(state.employees.worktrack, value)
      }
    },
    insights: {
      get(){
        return state.payroll.insights
      },
      set(value){
        state.payroll.insights = { ...state.payroll.insights, ...value }
      }
    },
    financials: {
      get(){
        return state.payroll.financials
      },
      set(value){
        state.payroll.financials = { ...state.payroll.financials, ...value }
      }
    },
    payrollRecords: {
      get(){
        return state.payroll.items
      },
      set(value){
        state.payroll.items = value
      }
    }
  })

  return adapter
}

const appState = createInitialAppState()
const appSettings = createLegacySettingsAdapter(appState)
window.HexaPayStore = {
  getState(){
    return appState
  },
  syncApprovalTemplates(){
    syncApprovalTemplatesForState(appState)
    return appState.payroll.workspace
  },
  getCurrentUser(){
    return getCurrentAuthUserFromState(appState)
  },
  login(email, password){
    const normalizedEmail = String(email || "").trim().toLowerCase()
    const passwordHint = String(password || "").trim()

    if(!normalizedEmail || !passwordHint){
      throw new Error("Email and password are required.")
    }

    let user = findCompanyUserByEmail(normalizedEmail)
    if(!user && normalizedEmail === String(appSettings.company.email || "").trim().toLowerCase()){
      user = createCompanyAuthUser({
        companyName: appSettings.company.name,
        email: normalizedEmail,
        role: "Admin"
      })
    }

    if(!user){
      throw new Error("Invalid company login.")
    }

    const currentUser = loginWithMockSession(appState, user)
    return {
      token: appState.auth.token,
      tokenType: "Bearer",
      currentUser,
      expiresIn: 3600
    }
  },
  logout(){
    const previousUser = getCurrentAuthUserFromState(appState)
    logoutMockSession(appState)
    return previousUser
  },
  listPayrollRuns(){
    return appState.payroll.runs
  },
  listPayrollItems(){
    return appState.payroll.items
  },
  savePayrollRun(run){
    const existingIndex = appState.payroll.runs.findIndex((item) => item.id === run.id)
    if(existingIndex >= 0){
      appState.payroll.runs[existingIndex] = run
    } else {
      appState.payroll.runs.push(run)
    }
    return run
  },
  replacePayrollItemsForRun(runId, items){
    appState.payroll.items = appState.payroll.items.filter((item) => item.runId !== runId)
    appState.payroll.items.push(...items)
    return items
  },
  listEmployees(){
    return appState.employees.records
  },
  findEmployeeById(employeeId){
    return appState.employees.records.find((employee) => employee.id === employeeId) || null
  },
  saveEmployee(record){
    return upsertEmployeeRecord(record)
  },
  removeEmployee(employeeId){
    const employeeIndex = appState.employees.records.findIndex((employee) => employee.id === employeeId)
    if(employeeIndex < 0){
      return null
    }

    const [deletedEmployee] = appState.employees.records.splice(employeeIndex, 1)

    if(appState.employees.selectedEmployeeId === employeeId){
      appState.employees.selectedEmployeeId = appState.employees.records[0]?.id || null
    }

    return deletedEmployee
  }
}
let payrollChartInstance
let workforceChartInstance
let selectedDepartmentId = null
let isEditingDepartment = false
let selectedContractId = appState.contracts.selectedContractId
let isEditingContract = false
let selectedPendingLeaveId = appState.leave.selectedRequestId
let selectedOvertimeRateId = null
let selectedCompanyHolidayId = null
let selectedNationalHolidayId = null
let selectedAttendanceEntryId = appState.attendance.selectedLogId
let selectedEmployeeAvatar = ""
let selectedProfileEmployeeAvatar = ""
let selectedEmployeeDocuments = []
let selectedContractDocuments = []
let selectedDepartmentIcon = "fa-building"
let overviewPayrollRangeMonths = 6
let overviewPendingPayrollType = "Monthly"
let overviewWorkforceMode = "department"
let exchangeRatesState = loadExchangeRates()

const departmentIconChoices = [
  { icon: "fa-building", label: "General" },
  { icon: "fa-briefcase", label: "Executive" },
  { icon: "fa-users", label: "HR" },
  { icon: "fa-laptop-code", label: "Engineering" },
  { icon: "fa-server", label: "ICT" },
  { icon: "fa-coins", label: "Finance" },
  { icon: "fa-bullhorn", label: "Marketing" },
  { icon: "fa-chart-line", label: "Sales" },
  { icon: "fa-headset", label: "Support" },
  { icon: "fa-truck", label: "Logistics" },
  { icon: "fa-people-group", label: "Casuals" },
  { icon: "fa-shield-halved", label: "Security" },
  { icon: "fa-hospital", label: "Wellness" },
  { icon: "fa-graduation-cap", label: "Training" },
  { icon: "fa-warehouse", label: "Operations" }
]

const nonTenderCurrencyCodes = new Set([
  "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XDR", "XPD", "XPF", "XPT",
  "XSU", "XTS", "XUA", "XXX", "BOV", "CHE", "CHW", "CLF", "COU", "MXV",
  "USN", "UYI"
])

function loadExchangeRates(){
const saved = localStorage.getItem(EXCHANGE_RATE_STORAGE_KEY)

if(!saved){
  return {
    base: BASE_CURRENCY,
    date: null,
    source: "Fallback",
    rates: { [BASE_CURRENCY.toLowerCase()]: 1 }
  }
}

try{
  const parsed = JSON.parse(saved)
  return {
    base: parsed.base || BASE_CURRENCY,
    date: parsed.date || null,
    source: parsed.source || "Fallback",
    rates: {
      [BASE_CURRENCY.toLowerCase()]: 1,
      ...(parsed.rates || {})
    }
  }
} catch (error){
  return {
    base: BASE_CURRENCY,
    date: null,
    source: "Fallback",
    rates: { [BASE_CURRENCY.toLowerCase()]: 1 }
  }
}
}

function persistExchangeRates(){
localStorage.setItem(EXCHANGE_RATE_STORAGE_KEY, JSON.stringify(exchangeRatesState))
}

function getSupportedCurrencyCodes(){
const fallbackCodes = ["KES", "USD", "EUR", "GBP", "UGX", "TZS", "RWF", "ZAR", "NGN", "GHS", "INR", "AED", "SAR", "CAD", "AUD", "JPY", "CNY"]

if(typeof Intl.supportedValuesOf !== "function"){
  return fallbackCodes
}

return Intl.supportedValuesOf("currency")
  .filter((code) => !nonTenderCurrencyCodes.has(code))
}

function getCurrencyDisplayName(code){
try{
  const displayNames = new Intl.DisplayNames(["en"], { type: "currency" })
  return displayNames.of(code) || code
} catch (error){
  return code
}
}

function renderCurrencyOptions(){
const currencyCodes = getSupportedCurrencyCodes()
  .map((code) => ({
    code,
    name: getCurrencyDisplayName(code)
  }))
  .sort((left, right) => left.name.localeCompare(right.name))

const optionsMarkup = currencyCodes.map((item) => `
  <option value="${item.code}">${item.code} - ${item.name}</option>
`).join("")

;[currencySelect].filter(Boolean).forEach((select) => {
  const currentValue = select === currencySelect
    ? (appState.settings.ui.pendingCurrencySelection || appSettings.company.currency || BASE_CURRENCY)
    : (appSettings.company.currency || BASE_CURRENCY)
  select.innerHTML = optionsMarkup
  select.value = currencyCodes.some((item) => item.code === currentValue) ? currentValue : BASE_CURRENCY
})
}

function updateCurrencyPreviewText(){
if(!currencyPreview) return

const activeCurrency = appSettings.company.currency || BASE_CURRENCY
const selectedCurrency = appState.settings.ui.pendingCurrencySelection || activeCurrency
const exchangeDate = exchangeRatesState.date
  ? ` Exchange rates updated ${exchangeRatesState.date}.`
  : " Exchange rates will sync when the dashboard is online."

if(selectedCurrency !== activeCurrency){
  currencyPreview.textContent = `Selected ${selectedCurrency}. Click Apply Currency to update the whole system.${exchangeDate}`
  return
}

const activeCurrencyLabel = getCurrencyDisplayLabel(activeCurrency)
currencyPreview.textContent = appState.settings.ui.currencyApplyMessage
  ? `${appState.settings.ui.currencyApplyMessage}${exchangeDate}`
  : `Payroll totals will display in ${activeCurrencyLabel}.${exchangeDate}`
}

function getExchangeRate(code){
const normalized = (code || BASE_CURRENCY).toLowerCase()
if(normalized === BASE_CURRENCY.toLowerCase()){
  return 1
}
return Number(exchangeRatesState.rates?.[normalized] || 1)
}

function getSelectedSystemCurrency(){
return appState.settings.ui.pendingCurrencySelection || currencySelect?.value || appSettings.company.currency || BASE_CURRENCY
}

function convertCurrencyAmount(amount, fromCurrency = BASE_CURRENCY, toCurrency = getSelectedSystemCurrency()){
const numericAmount = Number(amount || 0)
if(!numericAmount){
  return 0
}

const normalizedFrom = (fromCurrency || BASE_CURRENCY).toUpperCase()
const normalizedTo = (toCurrency || BASE_CURRENCY).toUpperCase()

if(normalizedFrom === normalizedTo){
  return numericAmount
}

const amountInBaseCurrency = normalizedFrom === BASE_CURRENCY
  ? numericAmount
  : numericAmount / getExchangeRate(normalizedFrom)

return normalizedTo === BASE_CURRENCY
  ? amountInBaseCurrency
  : amountInBaseCurrency * getExchangeRate(normalizedTo)
}

function getCurrencyFormatter(sourceCurrency = BASE_CURRENCY){
const targetCurrency = getSelectedSystemCurrency()
const locale = targetCurrency === "KES" ? "en-KE" : "en-US"

return {
  format(value, maximumFractionDigits = 0){
    const formattedValue = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: targetCurrency,
      currencyDisplay: targetCurrency === "KES" ? "symbol" : "narrowSymbol",
      maximumFractionDigits
    }).format(convertCurrencyAmount(value, sourceCurrency, targetCurrency))

    return targetCurrency === "KES"
      ? formattedValue.replace(/^KES/, "KSh").replace(/^Ksh/i, "KSh")
      : formattedValue
  }
}
}

function getCurrencyDisplayLabel(code = getSelectedSystemCurrency()){
switch((code || BASE_CURRENCY).toUpperCase()){
  case "KES":
    return "KSh"
  case "USD":
    return "$"
  case "EUR":
    return "EUR"
  case "GBP":
    return "GBP"
  default:
    return code.toUpperCase()
}
}

async function fetchLatestExchangeRates(){
const endpoints = [
  `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${BASE_CURRENCY.toLowerCase()}.min.json`,
  `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${BASE_CURRENCY.toLowerCase()}.json`
]

for(const endpoint of endpoints){
  try{
    const response = await fetch(endpoint, { cache: "no-store" })
    if(!response.ok){
      continue
    }

    const payload = await response.json()
    const rateTable = payload?.[BASE_CURRENCY.toLowerCase()]
    if(!rateTable){
      continue
    }

    exchangeRatesState = {
      base: BASE_CURRENCY,
      date: payload.date || new Date().toISOString().slice(0, 10),
      source: "currency-api",
      rates: {
        [BASE_CURRENCY.toLowerCase()]: 1,
        ...rateTable
      }
    }

    persistExchangeRates()
    renderCompanySettings()
    updateDashboardMetrics()
    renderPayrollSection()
    renderInsightsSection()
    renderFinancialsSection()
    renderOverviewCharts()
    return
  } catch (error){
  }
}
}

async function applySelectedCurrency(){
const nextCurrency = currencySelect?.value || appSettings.company.currency || BASE_CURRENCY
if(!nextCurrency){
  return
}

setActionButtonBusy(applyCurrencyButton, true, "Applying...")
try{
  if(window.HexaPayApi?.updateCurrencySettings && isAuthenticatedFromState(appState)){
    await window.HexaPayApi.updateCurrencySettings({
      currency_code: nextCurrency
    })
  }
} catch (error){
  console.error("Backend currency update failed.", error)
  appState.settings.ui.currencyApplyMessage = error?.payload?.error?.message || error?.message || "Currency update failed."
  renderCompanySettings()
  setActionButtonBusy(applyCurrencyButton, false)
  return
}

appSettings.company.currency = nextCurrency
appState.settings.ui.pendingCurrencySelection = null
appState.settings.ui.currencyApplyMessage = `Currency applied successfully. The system is now using ${getCurrencyDisplayLabel(nextCurrency)}.`
syncActiveCompany()
persistSettings()
if(payrollChartInstance){
  payrollChartInstance.destroy()
  payrollChartInstance = null
}
if(workforceChartInstance){
  workforceChartInstance.destroy()
  workforceChartInstance = null
}
renderCompanySettings()
renderCompanyDropdown()
updateDashboardMetrics()
renderPayrollSection()
renderInsightsSection()
renderFinancialsSection()
renderOverviewCharts()
addActivity("Currency updated", `Default payroll currency set to ${nextCurrency}.`)
setActionButtonBusy(applyCurrencyButton, false)
}

function getDepartmentIconClass(iconName){
return `fa-solid ${iconName || "fa-building"}`
}

function setAvatarPreview(container, imageSource, fallbackIcon = "fa-solid fa-circle-user"){
if(!container) return

container.classList.toggle("has-image", Boolean(imageSource))

if(imageSource){
  container.innerHTML = `<img src="${imageSource}" alt="Selected profile image" class="employee-avatar-image">`
  return
}

container.innerHTML = `<i class="${fallbackIcon}"></i>`
}

function getSelectedDocumentNames(fileInput){
  return Array.from(fileInput?.files || [])
    .map((file) => String(file?.name || "").trim())
    .filter(Boolean)
}

function appendSelectedDocumentNames(existingDocuments, fileInput){
  const nextDocuments = getSelectedDocumentNames(fileInput)
  return Array.from(new Set([...(existingDocuments || []), ...nextDocuments]))
}

function renderSelectedDocumentPreview(container, documentNames, emptyLabel = "No documents added yet."){
  if(!container) return

  const documents = Array.isArray(documentNames) ? documentNames.filter(Boolean) : []
  if(!documents.length){
    container.innerHTML = `<span class="document-upload-empty">${emptyLabel}</span>`
    return
  }

  container.innerHTML = documents.map((documentName) => `
    <div class="document-chip">
      <i class="fa-solid fa-file-lines"></i>
      <span>${documentName}</span>
    </div>
  `).join("")
}

function readImageFileAsDataUrl(file){
return new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.addEventListener("load", () => {
    resolve(typeof reader.result === "string" ? reader.result : "")
  })
  reader.addEventListener("error", () => {
    reject(new Error("Failed to read the selected image file."))
  })
  reader.readAsDataURL(file)
})
}

function renderDepartmentAvatarPreview(){
if(!departmentAvatarPreview) return
setAvatarPreview(departmentAvatarPreview, "", getDepartmentIconClass(selectedDepartmentIcon))
}

function renderDepartmentIconLibrary(){
if(!departmentIconLibrary) return

departmentIconLibrary.innerHTML = ""
departmentIconChoices.forEach((choice) => {
  const button = document.createElement("button")
  button.type = "button"
  button.className = "department-icon-option" + (choice.icon === selectedDepartmentIcon ? " active" : "")
  button.dataset.departmentIcon = choice.icon
  button.setAttribute("aria-label", `${choice.label} icon`)
  button.innerHTML = `
    <i class="${getDepartmentIconClass(choice.icon)}"></i>
    <span>${choice.label}</span>
  `
  departmentIconLibrary.appendChild(button)
})
}

function loadSettings(){
return createLegacySettingsAdapter(createInitialAppState())
}

function persistSettings(){
localStorage.setItem(
  UI_PREFERENCES_STORAGE_KEY,
  JSON.stringify({
    theme: appState.settings.appearance.theme,
    fontScale: appState.settings.appearance.fontScale
  })
)
}

async function performLiveBackendSync({ force = true } = {}){
  if(!hasLiveBackendSession() || !window.HexaPayApi){
    return null
  }

  if(document.visibilityState === "hidden"){
    return null
  }

  if(liveBackendSyncInFlight){
    return liveBackendSyncInFlight
  }

  liveBackendSyncInFlight = (async () => {
    try{
      await Promise.all([
        window.HexaPayApi.getCompany?.(),
        window.HexaPayApi.getMemberships?.(),
        syncOverviewDataFromBackend({ force, rerender: false }),
        syncContractsFromBackend({ force, rerender: false }),
        syncOvertimeRatesFromBackend({ force, rerender: false }),
        syncHolidaysFromBackend({ force, rerender: false })
      ])

      renderCompanySettings()
      renderCompanyDropdown()
      renderMembers()
      renderProfileState()
      updateDashboardMetrics()
      renderWorkforceSection()
      renderWorktrackSection()
      await renderPayrollSection()
      renderInsightsSection()
      renderFinancialsSection()
      return true
    } catch (error){
      console.error("Failed to perform live backend sync.", error)
      return null
    } finally {
      liveBackendSyncInFlight = null
    }
  })()

  return liveBackendSyncInFlight
}

function ensureLiveBackendSyncLoop(){
  if(liveBackendSyncTimer){
    return
  }

  liveBackendSyncTimer = window.setInterval(() => {
    void performLiveBackendSync({ force: true })
  }, LIVE_BACKEND_SYNC_INTERVAL_MS)
}

async function restorePersistedLiveBackendSession(){
  if(!window.HexaPayApi?.restorePersistedSession){
    return null
  }

  try{
    const restoredSession = await window.HexaPayApi.restorePersistedSession()
    if(!restoredSession){
      renderProfileState()
      return null
    }

    resetBackendDrivenViewSyncState()
    await performLiveBackendSync({ force: true })
    return restoredSession
  } catch (error){
    console.error("Failed to restore persisted live backend session.", error)
    renderProfileState()
    return null
  }
}

function downloadFile(filename, content, type){
const blob = new Blob([content], { type })
const link = document.createElement("a")
link.href = URL.createObjectURL(blob)
link.download = filename
link.click()
URL.revokeObjectURL(link.href)
}

function setActionButtonBusy(button, busy, busyLabel){
if(!button){
  return
}

if(busy){
  if(!button.dataset.defaultLabel){
    button.dataset.defaultLabel = button.textContent
  }
  button.disabled = true
  button.textContent = busyLabel
  return
}

button.disabled = false
button.textContent = button.dataset.defaultLabel || button.textContent
}

function addActivity(title, detail){
appSettings.activityHistory.unshift({ title, detail })
appSettings.activityHistory = appSettings.activityHistory.slice(0, 8)
persistSettings()
renderActivityHistory()
}

function getThemePreference(){
if(appSettings.appearance.theme === "system"){
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

return appSettings.appearance.theme
}

function applyTheme(){
const theme = getThemePreference()
document.body.setAttribute("data-theme", theme)
document.documentElement.style.setProperty("--font-scale", `${appSettings.appearance.fontScale}%`)

themeOptions.forEach((option) => {
  option.classList.toggle("active", option.dataset.themeOption === appSettings.appearance.theme)
})

if(fontScaleRange){
  fontScaleRange.value = appSettings.appearance.fontScale
}

if(fontScaleValue){
  fontScaleValue.textContent = `${appSettings.appearance.fontScale}%`
}

updateChartsTheme()
}

function renderCompanySettings(){
renderCurrencyOptions()
const activeCompany = getActiveCompany()
const companyName = activeCompany?.name || appSettings.company.name || ""
const displayCompanyName = companyName || "No Company Selected"

if(companyEditName){
  companyEditName.value = companyName
}

if(companyIndustry){
  companyIndustry.value = activeCompany?.industry || appSettings.company.industry || ""
}

if(companyEmail){
  companyEmail.value = activeCompany?.email || appSettings.company.email || ""
}

if(companyLogoInput){
  setAvatarPreview(companyLogoPreview, selectedCompanyLogo || activeCompany?.logoUrl || appSettings.company.logoUrl || "", "fa-solid fa-building")
}

if(currencySelect){
  currencySelect.value = appState.settings.ui.pendingCurrencySelection || activeCompany?.currency || appSettings.company.currency
}

if(companyLogoutButton){
  companyLogoutButton.hidden = false
  companyLogoutButton.disabled = !isAuthenticatedFromState(appState)
}

updateCurrencyPreviewText()
renderMembers()

document.getElementById("companyName").innerText = displayCompanyName

if(profileSignupCompany && !appSettings.profile.isLoggedIn){
  profileSignupCompany.value = companyName
}

if(profileSignupLogo && !appSettings.profile.isLoggedIn){
  setAvatarPreview(profileSignupLogoPreview, selectedSignupCompanyLogo || activeCompany?.logoUrl || appSettings.company.logoUrl || "", "fa-solid fa-building")
}
}

function getSelectableCompanies(){
const backendCompanies = Array.isArray(appState.company?.companies) ? appState.company.companies : []
const fallbackCompanies = Array.isArray(appSettings.companies) ? appSettings.companies : []
const sourceCompanies = backendCompanies.length ? backendCompanies : fallbackCompanies
const dedupedCompanies = []
const seenCompanyIds = new Set()

sourceCompanies.forEach((company) => {
  if(!company){
    return
  }

  const companyId = String(company.id || "").trim()
  if(companyId){
    if(seenCompanyIds.has(companyId)){
      return
    }
    seenCompanyIds.add(companyId)
  }

  dedupedCompanies.push(company)
})

return dedupedCompanies
}

function renderCompanyDropdown(){
if(!companyList) return

companyList.innerHTML = ""
const activeCompanyId = getActiveCompany()?.id

getSelectableCompanies().forEach((company) => {
  const item = document.createElement("button")
  item.type = "button"
  item.className = "company-dropdown-item"
  item.textContent = company.name || "No Company Selected"
  item.classList.toggle("active", String(company.id) === String(activeCompanyId))
  item.addEventListener("click", () => {
    void selectCompany(company.id)
  })
  companyList.appendChild(item)
})
}

function syncActiveCompany(){
const activeCompanyId = appSettings.company.id || appState.company.activeCompanyId
const existingIndex = appSettings.companies.findIndex((company) =>
  (activeCompanyId && String(company.id) === String(activeCompanyId)) ||
  company.name === appSettings.company.name
)

if(existingIndex >= 0){
  appSettings.companies[existingIndex] = {
    ...appSettings.companies[existingIndex],
    ...appSettings.company,
    ...(activeCompanyId ? { id: activeCompanyId } : {})
  }
  return
}

appSettings.companies.push({
  ...appSettings.company,
  ...(activeCompanyId ? { id: activeCompanyId } : {})
})
}

if(profileLoginEmail){
  profileLoginEmail.value = appSettings.profile.companyEmail
}

function renderProfileState(){
const currentAuthUser = getCurrentAuthUserFromState(appState)
const isLoggedIn = isAuthenticatedFromState(appState)
const activeCompany = getActiveCompany()
const companyLogo = activeCompany?.logoUrl || appSettings.company.logoUrl || "Assets/Logo.png"
const profileAvatar = currentAuthUser?.avatarUrl || companyLogo
const companyName = activeCompany?.name || appSettings.company.name || "No Company Selected"
const isCompanyProfileSession = isLoggedIn && isCompanyProfileUser(appState, currentAuthUser, activeCompany)
const displayName = isLoggedIn
  ? (currentAuthUser?.displayName || companyName)
  : companyName
const accessRole = isLoggedIn
  ? normalizeAuthRole(currentAuthUser?.role || "Member")
  : "Guest"
const displayRole = isLoggedIn
  ? (isCompanyProfileSession ? "Company Profile" : accessRole)
  : "Guest"

if(topbarProfileImage){
  topbarProfileImage.src = profileAvatar
}

function findCompanyUserByEmail(email, companyId = getActiveCompany()?.id){
  const normalizedEmail = String(email || "").trim().toLowerCase()
  if(!normalizedEmail || !companyId){
    return null
  }

  const membershipUserIds = appState.company.memberships
    .filter((membership) => membership.companyId === companyId)
    .map((membership) => membership.userId)

  return appState.auth.users.find((user) =>
    membershipUserIds.includes(user.id) &&
    String(user.email || "").trim().toLowerCase() === normalizedEmail
  ) || null
}

function createCompanyAuthUser({ companyName, email, role = "Admin" }){
  const normalizedRole = normalizeAuthRole(role)
  const company = getActiveCompany()
  if(!company){
    return null
  }

  const user = createUserModel({
    id: createStateEntityId("user"),
    email,
    displayName: companyName,
    role: normalizedRole
  })

  appState.auth.users.push(user)
  appState.company.memberships.push(createCompanyMembershipModel({
    id: createStateEntityId("membership"),
    companyId: company.id,
    userId: user.id,
    role: normalizedRole,
    status: "active"
  }))

  return user
}

if(profileHeroImage){
  profileHeroImage.src = profileAvatar
}

if(topbarProfileName){
  topbarProfileName.textContent = displayName
}

if(topbarProfileRole){
  topbarProfileRole.textContent = displayRole
}

if(profileHeroName){
  profileHeroName.textContent = companyName
}

if(profileHeroRole){
  profileHeroRole.textContent = isLoggedIn
    ? (isCompanyProfileSession
        ? `${companyName} company profile is signed in.`
        : `${displayName} is signed in as ${displayRole}.`)
    : "Sign in to the company profile, then create and manage company users."
}

if(profileSignupCompany){
  profileSignupCompany.value = activeCompany?.name || appSettings.company.name || ""
}

if(profileSignupEmail){
  profileSignupEmail.value = appSettings.company.email
}

if(profileUserSignupEmail && !profileUserSignupEmail.value){
  profileUserSignupEmail.value = appSettings.company.email || ""
}

if(userProfileCard){
  userProfileCard.classList.toggle("is-locked", !isLoggedIn)
}

if(profileUserSignupButton){
  profileUserSignupButton.disabled = !(isLoggedIn && userHasRoleAccess(appState, ["Admin"]))
}

if(companyLogoutButton){
  companyLogoutButton.hidden = !isLoggedIn
}

if(profileAuthStatus){
  const authMessage = appState.settings.ui.profileAuthMessage
  if(isLoggedIn){
    const accessLabel = appState.auth.roleAccess[accessRole]?.join(", ") || "read-only placeholders"
    profileAuthStatus.textContent = authMessage || (isCompanyProfileSession
      ? `${hasLiveBackendSession() ? "Authenticated with live backend session." : "Authenticated with local fallback session."} Company profile session is active. Create company users here, and those users can log in with their own email and password. Admins can also promote or demote user roles. Access: ${accessLabel}.`
      : `${hasLiveBackendSession() ? "Authenticated with live backend session." : "Authenticated with local fallback session."} Active role: ${displayRole}. Admins can create company users here, and those users can log in with their own email and password. Admins can also promote or demote user roles. Access: ${accessLabel}.`)
  } else {
    profileAuthStatus.textContent = authMessage || "Signed out. Use the company email to sign in first, then create company users below."
  }
}
}

function renderMembers(){
if(!memberList) return

memberList.innerHTML = ""
const activeAdminCount = appSettings.members.filter((member) => {
  const normalizedStatus = String(member.status || "active").trim().toLowerCase()
  return normalizedStatus !== "removed" &&
    normalizedStatus !== "suspended" &&
    normalizeAuthRole(member.role) === "Admin"
}).length

appSettings.members.forEach((member) => {
  const normalizedRole = normalizeAuthRole(member.role)
  const promoteAction = {
    action: "promote",
    role: "",
    label: "Promote",
    disabled: false,
    title: ""
  }
  const demoteAction = {
    action: "demote",
    role: "",
    label: "Demote",
    disabled: false,
    title: ""
  }

  if(normalizedRole === "Admin"){
    promoteAction.disabled = true
    promoteAction.label = "Promote"
    promoteAction.title = "This user is already at the highest role."
    demoteAction.role = "MANAGER"
    demoteAction.label = activeAdminCount <= 1 ? "Keep 1 Admin" : "Demote to Manager"
    demoteAction.disabled = activeAdminCount <= 1
    demoteAction.title = activeAdminCount <= 1
      ? "At least one active admin must remain on the company."
      : "Move this user down to Manager."
  } else if(normalizedRole === "Manager"){
    promoteAction.role = "ADMIN"
    promoteAction.label = "Promote to Admin"
    promoteAction.title = "Grant full admin access."
    demoteAction.role = "VIEWER"
    demoteAction.label = "Demote to Viewer"
    demoteAction.title = "Limit this user to read-only access."
  } else {
    promoteAction.role = "MANAGER"
    promoteAction.label = "Promote to Manager"
    promoteAction.title = "Grant operational manager access."
    demoteAction.disabled = true
    demoteAction.label = "Demote"
    demoteAction.title = "This user is already at the lowest role."
  }

  const memberActions = [promoteAction, demoteAction]

  const item = document.createElement("div")
  item.className = "member-item"
  item.innerHTML = `
    <div class="member-meta">
      <strong>${member.name}</strong>
      <span>${normalizedRole}${member.email ? ` • ${member.email}` : ""}${member.status ? ` • ${member.status}` : ""}</span>
    </div>
    <div class="member-actions">
      ${memberActions.map((action) => `
        <button
          type="button"
          data-member-id="${member.id}"
          data-member-action="${action.action}"
          data-member-role="${action.role}"
          ${action.disabled ? "disabled" : ""}
          ${action.title ? `title="${action.title}"` : ""}
        >${action.label}</button>
      `).join("")}
    </div>
  `
  memberList.appendChild(item)
})
}

async function performCompanyLogout(){
let logoutResult = null
try{
  logoutResult = await window.HexaPayApi.logout()
} catch (error){
  console.error("Logout failed", error)
  setProfileAuthMessage(error?.message || "Logout failed. Please try again.", "error")
  renderProfileState()
  return
}

setProfileAuthMessage("Signed out successfully.", "success")
resetBackendDrivenViewSyncState()
persistSettings()
await window.HexaPayApi.getCompany?.().catch(() => null)
renderProfileState()
renderCompanySettings()
renderCompanyDropdown()
renderWorkforceSection()
renderWorktrackSection()
renderPayrollSection()
if(profileLoginPassword){
  profileLoginPassword.value = ""
}
addActivity("Logged out", `${logoutResult?.previousUser?.displayName || "Current user"} signed out of the company profile.`)
}

function renderActivityHistory(){
if(!activityHistoryList) return

activityHistoryList.innerHTML = ""

appSettings.activityHistory.forEach((entry) => {
  const item = document.createElement("div")
  item.className = "activity-item"
  item.innerHTML = `
    <div>
      <strong>${entry.title}</strong>
      <span>${entry.detail}</span>
    </div>
  `
  activityHistoryList.appendChild(item)
})
}

function estimateSalaryByPaymentType(type){
switch((type || "").toLowerCase()){
  case "weekly":
    return 42000
  case "monthly":
    return 180000
  case "daily":
    return 6500
  default:
    return 100000
}
}

function normalizeEmployeePaymentTypeLabel(value){
  const normalizedValue = String(value || "").trim().toLowerCase()
  if(normalizedValue === "daily"){
    return "Daily"
  }

  if(normalizedValue === "weekly"){
    return "Weekly"
  }

  return "Monthly"
}

function normalizeEmployeePaymentBasisValue(paymentType, value){
  const normalizedPaymentType = String(paymentType || "").trim().toLowerCase()
  if(normalizedPaymentType === "daily"){
    return "attendance_dependent"
  }

  return String(value || "").trim().toLowerCase() === "attendance_dependent"
    ? "attendance_dependent"
    : "standard"
}

function shouldShowPaymentBasisSelection(paymentType){
  const normalizedPaymentType = String(paymentType || "").trim().toLowerCase()
  return normalizedPaymentType === "weekly" || normalizedPaymentType === "monthly"
}

function formatEmployeePaymentBasisLabel(paymentBasis){
  return normalizeEmployeePaymentBasisValue("", paymentBasis) === "attendance_dependent"
    ? "Attendance dependent"
    : "Standard"
}

function formatEmployeePaymentTypeDisplay(employee){
  const paymentType = normalizeEmployeePaymentTypeLabel(employee?.paymentType || employee?.employmentType || "Monthly")
  if(!shouldShowPaymentBasisSelection(paymentType)){
    return paymentType
  }

  return `${paymentType} - ${formatEmployeePaymentBasisLabel(employee?.paymentBasis)}`
}

function createStateEntityId(prefix){
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function getActiveCompany(){
  return getActiveCompanyFromState(appState)
}

function getDepartmentById(departmentId){
  const activeCompanyId = getActiveCompany()?.id
  return appState.company.departments.find((department) =>
    String(department.id) === String(departmentId) &&
    (!activeCompanyId || department.companyId === activeCompanyId)
  ) || null
}

function getDepartmentByName(name){
  const activeCompanyId = getActiveCompany()?.id
  return appState.company.departments.find((department) =>
    department.name.toLowerCase() === String(name || "").toLowerCase() &&
    (!activeCompanyId || department.companyId === activeCompanyId)
  ) || null
}

function getAvailableDepartments(){
  const activeCompanyId = getActiveCompany()?.id
  return appState.company.departments.filter((department) =>
    (!activeCompanyId || department.companyId === activeCompanyId) &&
    String(department.status || "active").toLowerCase() === "active"
  )
}

function normalizePayrollSalaryTypeLabel(value){
  const normalizedValue = String(value || "").trim().toLowerCase()
  if(normalizedValue === "daily"){
    return "Daily"
  }

  if(normalizedValue === "weekly"){
    return "Weekly"
  }

  return "Monthly"
}

function getPayrollDepartmentsForSalaryType(salaryType){
  return getAvailableDepartments()
}

function resolvePayrollDepartmentSelectionId(rawValue, departments = getPayrollDepartmentsForSalaryType(appSettings.payroll.salaryType)){
  const normalizedValue = String(rawValue || "").trim()
  if(!normalizedValue){
    return ""
  }

  const directMatch = departments.find((department) => String(department.id) === normalizedValue)
  if(directMatch){
    return String(directMatch.id)
  }

  return departments.find((department) =>
    String(department.name || "").trim().toLowerCase() === normalizedValue.toLowerCase()
  )?.id || ""
}

function renderEmployeeDepartmentOptions(selectedDepartmentId = ""){
  if(!empDept) return

  const departments = getAvailableDepartments()
  const normalizedSelectedDepartmentId = String(selectedDepartmentId || "")
  const previousValue = String(empDept.value || "")

  empDept.innerHTML = `<option value="">Select department</option>`

  departments.forEach((department) => {
    const option = document.createElement("option")
    option.value = String(department.id)
    option.textContent = department.name
    empDept.appendChild(option)
  })

  const nextValue = normalizedSelectedDepartmentId || previousValue
  if(nextValue && Array.from(empDept.options).some((option) => option.value === nextValue)){
    empDept.value = nextValue
  }
}

function renderProfileEmployeeDepartmentOptions(selectedDepartmentId = ""){
  if(!profileEmpDept) return

  const departments = getAvailableDepartments()
  const normalizedSelectedDepartmentId = String(selectedDepartmentId || "")
  const previousValue = String(profileEmpDept.value || "")

  profileEmpDept.innerHTML = `<option value="">Select department</option>`

  departments.forEach((department) => {
    const option = document.createElement("option")
    option.value = String(department.id)
    option.textContent = department.name
    profileEmpDept.appendChild(option)
  })

  const nextValue = normalizedSelectedDepartmentId || previousValue
  if(nextValue && Array.from(profileEmpDept.options).some((option) => option.value === nextValue)){
    profileEmpDept.value = nextValue
  }
}

function syncEmployeePaymentBasisControl(rowElement, selectElement, paymentType, currentBasis = "standard"){
  if(!rowElement || !selectElement){
    return
  }

  const shouldShow = shouldShowPaymentBasisSelection(paymentType)
  rowElement.classList.toggle("is-hidden", !shouldShow)
  selectElement.value = normalizeEmployeePaymentBasisValue(paymentType, currentBasis)
}

function syncDepartmentRoleSummary(departmentId, pendingRoleTitle = ""){
  const department = getDepartmentById(departmentId)
  if(!department){
    return
  }

  const departmentRoleTitles = new Set(
    getEmployeeRecords()
      .filter((employee) => String(employee.departmentId) === String(departmentId))
      .map((employee) => String(employee.roleTitle || "").trim())
      .filter(Boolean)
  )

  const normalizedPendingRoleTitle = String(pendingRoleTitle || "").trim()
  if(normalizedPendingRoleTitle){
    departmentRoleTitles.add(normalizedPendingRoleTitle)
  }

  department.roles = Math.max(1, departmentRoleTitles.size || Number(department.roles || 0) || 1)
}

function getDepartmentRoleCount(department){
  if(!department){
    return 0
  }

  const roleTitles = new Set(
    getEmployeeRecords()
      .filter((employee) => String(employee.departmentId) === String(department.id))
      .map((employee) => String(employee.roleTitle || "").trim())
      .filter(Boolean)
  )

  return roleTitles.size || Number(department.roles || 0) || 0
}

function getEmployeeById(employeeId){
  return getEmployeeRecords().find((employee) => employee.id === employeeId) || null
}

function getContractRecords(){
  return appState.contracts.records
}

function getVisibleContractRecords(){
  const activeCompanyId = getActiveCompany()?.id
  return getContractRecords().filter((contract) => !activeCompanyId || contract.companyId === activeCompanyId)
}

function getContractById(contractId){
  return getVisibleContractRecords().find((contract) => String(contract.id) === String(contractId)) || null
}

function getContractsByStatus(status){
  return getVisibleContractRecords().filter((contract) => contract.status === status)
}

function getAttendanceLogRecords(){
  return appState.attendance.records
}

function getVisibleAttendanceLogRecords(){
  const activeCompanyId = getActiveCompany()?.id
  return getAttendanceLogRecords().filter((log) => !activeCompanyId || log.companyId === activeCompanyId)
}

function getAttendanceLogById(logId){
  return getVisibleAttendanceLogRecords().find((log) => String(log.id) === String(logId)) || null
}

function getAttendanceLogsForEmployee(employeeId, logs = getVisibleAttendanceLogRecords()){
  return logs.filter((log) => String(log.employeeId) === String(employeeId))
}

function getLeaveRequestRecords(){
  return appState.leave.records
}

function getVisibleLeaveRequestRecords(){
  const activeCompanyId = getActiveCompany()?.id
  return getLeaveRequestRecords().filter((request) => !activeCompanyId || request.companyId === activeCompanyId)
}

function getLeaveRequestById(requestId){
  return getVisibleLeaveRequestRecords().find((request) => String(request.id) === String(requestId)) || null
}

function getCompanyHolidayRecords(){
  return appState.holidays.companyRecords
}

function getVisibleCompanyHolidayRecords(){
  const activeCompanyId = getActiveCompany()?.id
  return getCompanyHolidayRecords().filter((holiday) => !activeCompanyId || holiday.companyId === activeCompanyId)
}

function getNationalHolidayRecords(){
  return appState.holidays.nationalRecords
}

function getVisibleNationalHolidayRecords(){
  const activeCompanyId = getActiveCompany()?.id
  return getNationalHolidayRecords().filter((holiday) => !activeCompanyId || holiday.companyId === activeCompanyId)
}

function getHolidaySummary(){
  return {
    companyCount: getVisibleCompanyHolidayRecords().length,
    nationalCount: getVisibleNationalHolidayRecords().length
  }
}

function getSelectedEmployee(){
  return getEmployeeById(appState.employees.selectedEmployeeId)
}

function getEmployeeDisplayName(employee){
  return employee?.fullName || ""
}

function getEmployeeDepartmentName(employee){
  return getDepartmentById(employee?.departmentId)?.name || "Unassigned"
}

function getEmployeesByStatuses(statuses){
  const normalizedStatuses = statuses.map((status) => String(status).toUpperCase())
  return getEmployeeRecords().filter((employee) => normalizedStatuses.includes(String(employee.status || "").toUpperCase()))
}

function findEmployeeByName(name){
  return getEmployeeRecords().find((employee) => employee.fullName === name) || null
}

function resolveEmployeeEntity(source){
  if(!source){
    return null
  }

  if(typeof source === "string"){
    return getEmployeeById(source)
  }

  if(source.id && source.fullName){
    return source
  }

  return null
}

function renderEmployeeFilterDepartmentOptions(){
  if(!employeeDepartmentFilter){
    return
  }

  const previousValue = String(employeeDepartmentFilter.value || "")
  const departments = getAvailableDepartments()
  employeeDepartmentFilter.innerHTML = `<option value="">Department</option>`

  departments.forEach((department) => {
    const option = document.createElement("option")
    option.value = String(department.id)
    option.textContent = department.name
    employeeDepartmentFilter.appendChild(option)
  })

  if(previousValue && Array.from(employeeDepartmentFilter.options).some((option) => option.value === previousValue)){
    employeeDepartmentFilter.value = previousValue
  }
}

function getFilteredEmployees(){
  const searchValue = String(employeeSearchInput?.value || "").trim().toLowerCase()
  const departmentValue = String(employeeDepartmentFilter?.value || "").trim()
  const employmentTypeValue = String(employeeEmploymentTypeFilter?.value || "").trim()
  const statusValue = String(employeeStatusFilter?.value || "").trim().toUpperCase()
  const sortValue = String(employeeSortFilter?.value || "").trim()

  let employees = [...getEmployeeRecords()]

  if(searchValue){
    employees = employees.filter((employee) => {
      const departmentName = getDepartmentById(employee.departmentId)?.name || "Unassigned"
      return [
        employee.employeeNumber,
        employee.fullName,
        employee.roleTitle,
        employee.identificationNumber,
        employee.accountNumber,
        departmentName
      ].some((value) => String(value || "").toLowerCase().includes(searchValue))
    })
  }

  if(departmentValue){
    employees = employees.filter((employee) => String(employee.departmentId || "") === departmentValue)
  }

  if(employmentTypeValue){
    employees = employees.filter((employee) => String(employee.paymentType || employee.employmentType || "") === employmentTypeValue)
  }

  if(statusValue){
    employees = employees.filter((employee) => String(employee.status || "").toUpperCase() === statusValue)
  }

  const parseEmployeePayrollSequence = (employeeNumber) => {
    const normalizedValue = String(employeeNumber || "").trim().toUpperCase()
    if(!normalizedValue){
      return null
    }

    const match = normalizedValue.match(/(\d+)$/)
    if(!match){
      return null
    }

    return Number(match[1])
  }

  const sortEmployeesByPayrollNumber = (leftEmployee, rightEmployee) => {
    const leftNumber = String(leftEmployee?.employeeNumber || "").trim().toUpperCase()
    const rightNumber = String(rightEmployee?.employeeNumber || "").trim().toUpperCase()
    const leftSequence = parseEmployeePayrollSequence(leftNumber)
    const rightSequence = parseEmployeePayrollSequence(rightNumber)

    if(leftSequence !== null && rightSequence !== null){
      if(leftSequence !== rightSequence){
        return leftSequence - rightSequence
      }

      if(leftNumber !== rightNumber){
        return leftNumber.localeCompare(rightNumber)
      }
    } else if(leftSequence !== null){
      return -1
    } else if(rightSequence !== null){
      return 1
    }

    return String(leftEmployee?.fullName || "").localeCompare(String(rightEmployee?.fullName || ""))
  }

  employees.sort(sortEmployeesByPayrollNumber)

  if(sortValue === "name"){
    employees.sort((a, b) => String(a.fullName || "").localeCompare(String(b.fullName || "")))
  } else if(sortValue === "employmentDate"){
    employees.sort((a, b) => String(a.employmentDate || "").localeCompare(String(b.employmentDate || "")))
  } else if(sortValue === "department"){
    employees.sort((a, b) => {
      const departmentA = getDepartmentById(a.departmentId)?.name || "Unassigned"
      const departmentB = getDepartmentById(b.departmentId)?.name || "Unassigned"
      return departmentA.localeCompare(departmentB)
    })
  } else if(sortValue === "status"){
    employees.sort((a, b) => String(a.status || "").localeCompare(String(b.status || "")))
  }

  return employees
}

function buildEmployeeMeta(employee){
  if(!employee){
    return createEmployeeMeta()
  }

  return {
    employeeNumber: employee.employeeNumber || "",
    identification: employee.identificationNumber,
    accountNumber: employee.accountNumber,
    accountDetails: employee.accountDetails,
    role: employee.roleTitle,
    salary: employee.salaryAmount,
    unpaidBalance: Number(employee.unpaidBalance || 0),
    profileImage: employee.profileImage || "",
    documents: employee.documents || [],
    salaryHistory: Array.isArray(employee.salaryHistory) ? employee.salaryHistory : [],
    financialProfile: normalizeEmployeeFinancialProfile(employee.financialProfile)
  }
}

function getEmployeeActualSalaryHistory(employee){
  const employeeId = String(employee?.id || "").trim()
  if(!employeeId){
    return []
  }

  const payrollHistory = getPayrollItems()
    .filter((item) => String(item.employeeId || "").trim() === employeeId)
    .filter((item) => {
      const payrollRun = getPayrollRunById(item.runId)
      return Boolean(item.paid || item.signed || item.paidAt || String(payrollRun?.status || "").trim().toLowerCase() === "posted")
    })
    .map((item) => {
      const payrollRun = getPayrollRunById(item.runId)
      const salaryType = item.salaryType || payrollRun?.salaryType || "Monthly"
      const period = item.period || payrollRun?.period || ""
      const gross = Number(item.grossPay || item.baseSalary || 0)
      const deductions = Number(item.deductions || 0)
      const allowance = Number(item.allowances || 0)
      return {
        date: formatPayrollPeriodLabel(period, salaryType),
        gross,
        deductions,
        allowance,
        net: Number(item.netPay || (gross - deductions + allowance) || 0),
        sortKey: String(item.paidAt || payrollRun?.lastPaidAt || payrollRun?.generatedAt || period || "")
      }
    })
    .sort((entryA, entryB) => String(entryB.sortKey).localeCompare(String(entryA.sortKey)))

  if(payrollHistory.length){
    return payrollHistory
  }

  if(hasRealBackendSession()){
    return []
  }

  return (Array.isArray(employee.salaryHistory) ? employee.salaryHistory : [])
    .map((entry) => ({
      date: entry?.date || "",
      gross: Number(entry?.gross || 0),
      deductions: Number(entry?.deductions || 0),
      allowance: Number(entry?.allowance || 0),
      net: Number(entry?.net || ((Number(entry?.gross || 0) - Number(entry?.deductions || 0)) + Number(entry?.allowance || 0)) || 0),
      sortKey: String(entry?.date || "")
    }))
    .sort((entryA, entryB) => String(entryB.sortKey).localeCompare(String(entryA.sortKey)))
}

function renderEmployeeSalaryHistoryTable(employee, formatter = getCurrencyFormatter()){
  if(!salaryHistoryBody){
    return
  }

  const salaryHistoryEntries = getEmployeeActualSalaryHistory(employee)
  salaryHistoryBody.innerHTML = ""
  if(!salaryHistoryEntries.length){
    const tr = document.createElement("tr")
    const isLoadingLiveHistory = hasRealBackendSession() && salaryHistoryLoadState.has(String(employee?.id || "").trim())
    tr.innerHTML = `<td colspan="5">${isLoadingLiveHistory ? "Loading salary history..." : "No salary history recorded yet."}</td>`
    salaryHistoryBody.appendChild(tr)
    return
  }

  salaryHistoryEntries.forEach((entry) => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${entry.date}</td>
      <td>${formatter.format(Number(entry.gross || 0))}</td>
      <td>${formatter.format(Number(entry.deductions || 0))}</td>
      <td>${formatter.format(Number(entry.allowance || 0))}</td>
      <td>${formatter.format(Number(entry.net || 0))}</td>
    `
    salaryHistoryBody.appendChild(tr)
  })
}

async function ensureEmployeePayrollHistoryLoaded(employee){
  if(!hasRealBackendSession() || !window.HexaPayApi?.getPayrollRuns || !window.HexaPayApi?.getPayrollRun){
    return
  }

  const employeeId = String(employee?.id || "").trim()
  if(!employeeId || getPayrollItems().some((item) => String(item.employeeId || "").trim() === employeeId)){
    return
  }

  if(salaryHistoryLoadState.has(employeeId)){
    return salaryHistoryLoadState.get(employeeId)
  }

  const loader = (async () => {
    const payrollRuns = await window.HexaPayApi.getPayrollRuns()
    const runsWithItems = payrollRuns.filter((run) => Number(run.itemCount || run.itemIds?.length || 0) > 0)
    await Promise.all(runsWithItems.map(async (run) => {
      try{
        await window.HexaPayApi.getPayrollRun(run.id)
      } catch (error){
        console.error("Failed to load payroll history run for employee salary history", error)
      }
    }))
  })().finally(() => {
    salaryHistoryLoadState.delete(employeeId)
  })

  salaryHistoryLoadState.set(employeeId, loader)
  return loader
}

function upsertEmployeeRecord(record){
  if(!record){
    return null
  }

  const existingIndex = appState.employees.records.findIndex((employee) => employee.id === record.id)

  if(existingIndex >= 0){
    appState.employees.records[existingIndex] = record
  } else {
    appState.employees.records.push(record)
  }

  return record
}

function getEmployeeRecords(){
  const activeCompanyId = getActiveCompany()?.id
  return appState.employees.records.filter((employee) => !activeCompanyId || employee.companyId === activeCompanyId)
}

function getPayrollRuns(){
  const activeCompanyId = getActiveCompany()?.id
  return appState.payroll.runs.filter((run) => !activeCompanyId || run.companyId === activeCompanyId)
}

function getPayrollItems(){
  const activeCompanyId = getActiveCompany()?.id
  return appState.payroll.items.filter((item) => !activeCompanyId || item.companyId === activeCompanyId)
}

function getPayrollRunById(runId){
  return getPayrollRuns().find((run) => run.id === runId) || null
}

function getPayrollItemsByRunId(runId){
  return getPayrollItems().filter((item) => item.runId === runId)
}

function getTodayDateKey(){
  const today = new Date()
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-")
}

function getCurrentPayrollMonthKey(){
  return getTodayDateKey().slice(0, 7)
}

function getCurrentPayrollDayNumber(){
  return Number(getTodayDateKey().slice(8, 10))
}

function getTomorrowDateKey(){
  const tomorrow = new Date()
  tomorrow.setHours(0, 0, 0, 0)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, "0"),
    String(tomorrow.getDate()).padStart(2, "0")
  ].join("-")
}

function parseLocalDateKey(dateKey){
  const [year, month, day] = String(dateKey || "").split("-").map(Number)
  if(!year || !month || !day){
    return null
  }
  return new Date(year, month - 1, day)
}

function getNormalizedPaydaySelection(paydayMonthValue, paydayDayValue){
  const tomorrowMonthKey = getTomorrowDateKey().slice(0, 7)
  const tomorrowDayNumber = Number(getTomorrowDateKey().slice(8, 10))
  const safeMonthValue = String(paydayMonthValue || tomorrowMonthKey)
  const [year, month] = safeMonthValue.split("-").map(Number)

  if(!year || !month){
    return {
      paydayMonth: tomorrowMonthKey,
      paydayDay: String(tomorrowDayNumber)
    }
  }

  const maxDay = new Date(year, month, 0).getDate()
  const minimumDay = safeMonthValue === tomorrowMonthKey ? tomorrowDayNumber : 1

  if(minimumDay > maxDay){
    const nextMonthDate = new Date(year, month, 1)
    return {
      paydayMonth: `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, "0")}`,
      paydayDay: "1"
    }
  }

  const requestedDay = Number(paydayDayValue || minimumDay)
  const normalizedDay = Math.min(Math.max(requestedDay, minimumDay), maxDay)

  return {
    paydayMonth: safeMonthValue,
    paydayDay: String(normalizedDay)
  }
}

function formatUiDate(value){
  if(!value){
    return ""
  }

  const normalized = String(value).slice(0, 10)
  const [year, month, day] = normalized.split("-")
  if(year && month && day){
    return `${day}/${month}/${year}`
  }

  return normalized
}

function parseDateValue(value){
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function isDateWithinRange(dateKey, startKey, endKey){
  if(!dateKey || !startKey || !endKey){
    return false
  }

  return dateKey >= startKey && dateKey <= endKey
}

function getCurrentMonthPayrollTotal(){
  const currentMonth = getTodayDateKey().slice(0, 7)
  const monthlyRuns = getPayrollRuns().filter((run) =>
    String(run.period || "") === currentMonth &&
    String(run.salaryType || "").trim().toLowerCase() === "monthly"
  )

  if(monthlyRuns.length){
    const monthlyRunIds = new Set(monthlyRuns.map((run) => String(run.id)))
    const monthlyItems = getPayrollItems().filter((item) =>
      monthlyRunIds.has(String(item.runId)) &&
      String(item.salaryType || "").trim().toLowerCase() === "monthly"
    )

    if(monthlyItems.length){
      return monthlyItems.reduce((sum, item) => sum + Number(item.netPay || 0), 0)
    }
  }

  if(monthlyRuns.length){
    return monthlyRuns.reduce((sum, run) => sum + Number(run.totals?.netPay || 0), 0)
  }

  return 0
}

function getIsoWeekPeriodKey(date){
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayNumber = (target.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNumber + 3)

  const firstThursday = new Date(target.getFullYear(), 0, 4)
  const firstDayNumber = (firstThursday.getDay() + 6) % 7
  firstThursday.setDate(firstThursday.getDate() - firstDayNumber + 3)

  const weekNumber = 1 + Math.round((target - firstThursday) / (7 * 24 * 60 * 60 * 1000))
  return `${target.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`
}

function markPayrollRunStale(){
  appSettings.payroll.forceRegenerate = true
  try{
    const storeState = window.HexaPayStore?.getState?.()
    if(storeState?.payroll?.workspace){
      storeState.payroll.workspace.forceRegenerate = true
    }
  } catch (error){
    console.error("Failed to mark backend payroll workspace as stale.", error)
  }
}

function getStartOfIsoWeek(date){
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayNumber = (start.getDay() + 6) % 7
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - dayNumber)
  return start
}

function getEndOfIsoWeek(date){
  const end = getStartOfIsoWeek(date)
  end.setDate(end.getDate() + 6)
  return end
}

function formatDateKey(date){
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-")
}

function formatPayrollMonthLabel(monthKey){
  const [year, month] = String(monthKey || "").split("-").map(Number)
  if(!year || !month){
    return String(monthKey || "")
  }

  return new Intl.DateTimeFormat("en-KE", {
    month: "long",
    year: "numeric"
  }).format(new Date(year, month - 1, 1))
}

function formatPayrollDayLabel(dayKey){
  const parsedDate = parseLocalDateKey(dayKey)
  if(!parsedDate){
    return String(dayKey || "")
  }

  return new Intl.DateTimeFormat("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(parsedDate)
}

function formatPayrollPeriodLabel(period, salaryType = "Monthly"){
  const normalizedSalaryType = normalizePayrollSalaryTypeLabel(salaryType)
  if(normalizedSalaryType === "Daily"){
    return formatPayrollDayLabel(period)
  }

  return normalizedSalaryType === "Weekly"
    ? String(period || "")
    : formatPayrollMonthLabel(period)
}

function getPayrollRunStatusLabel(status){
  const normalizedStatus = String(status || "").trim().toLowerCase()
  if(normalizedStatus === "approved"){
    return "Approved"
  }

  if(normalizedStatus === "rejected"){
    return "Rejected"
  }

  if(normalizedStatus === "posted"){
    return "Posted"
  }

  if(normalizedStatus === "pending_approval"){
    return "Pending Approval"
  }

  return "Draft"
}

function getPayrollHistoryViewForRun(run){
  return normalizePayrollSalaryTypeLabel(run?.salaryType).toLowerCase()
}

function doesPayrollRunMatchHistoryView(run, view){
  const normalizedView = String(view || "daily").trim().toLowerCase()
  return getPayrollHistoryViewForRun(run) === normalizedView
}

function syncPayrollHistoryControls(payrollRuns){
  document.querySelectorAll("[data-payroll-history-view]").forEach((button) => {
    button.classList.toggle("approved", button.dataset.payrollHistoryView === appSettings.payroll.historyView)
  })

  if(!payrollHistorySelect){
    return
  }

  const filteredRuns = payrollRuns.filter((run) => doesPayrollRunMatchHistoryView(run, appSettings.payroll.historyView))
  const currentSelection = String(appSettings.payroll.historyRunId || "").trim()
  const nextSelection = filteredRuns.some((run) => run.id === currentSelection) ? currentSelection : ""
  payrollHistorySelect.innerHTML = `<option value="">All past payrolls</option>`
  filteredRuns.forEach((run) => {
    const option = document.createElement("option")
    option.value = run.id
    option.textContent = `${formatPayrollPeriodLabel(run.period, run.salaryType)}${run.departmentScope ? ` • ${run.departmentScope}` : ""}`
    payrollHistorySelect.appendChild(option)
  })
  appSettings.payroll.historyRunId = nextSelection
  payrollHistorySelect.value = nextSelection
}

function getPayrollDueOptions(salaryType){
  const normalizedSalaryType = normalizePayrollSalaryTypeLabel(salaryType)
  if(normalizedSalaryType === "Daily"){
    const today = new Date()
    return Array.from({ length: 14 }, (_, index) => {
      const payrollDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index)
      const value = formatDateKey(payrollDate)
      return {
        value,
        label: formatPayrollDayLabel(value)
      }
    })
  }

  if(normalizedSalaryType === "Weekly"){
    const firstWeekStart = getStartOfIsoWeek(new Date())
    const rangeFormatter = new Intl.DateTimeFormat("en-KE", {
      day: "numeric",
      month: "short"
    })

    return Array.from({ length: 8 }, (_, index) => {
      const weekStart = new Date(firstWeekStart)
      weekStart.setDate(firstWeekStart.getDate() + (index * 7))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return {
        value: getIsoWeekPeriodKey(weekStart),
        label: `Week ${index + 1} (${rangeFormatter.format(weekStart)} - ${rangeFormatter.format(weekEnd)})`
      }
    })
  }

  const today = new Date()
  return Array.from({ length: 12 }, (_, index) => {
    const monthDate = new Date(today.getFullYear(), today.getMonth() + index, 1)
    const value = [
      monthDate.getFullYear(),
      String(monthDate.getMonth() + 1).padStart(2, "0")
    ].join("-")
    return {
      value,
      label: formatPayrollMonthLabel(value)
    }
  })
}

function renderPayrollDueOptions(){
  if(!payrollDueSelect){
    return
  }

  const options = getPayrollDueOptions(appSettings.payroll.salaryType)
  const nextValue = options.some((option) => option.value === appSettings.payroll.due)
    ? appSettings.payroll.due
    : (options[0]?.value || "")

  payrollDueSelect.innerHTML = ""
  options.forEach((option) => {
    const optionElement = document.createElement("option")
    optionElement.value = option.value
    optionElement.textContent = option.label
    payrollDueSelect.appendChild(optionElement)
  })

  appSettings.payroll.due = nextValue
  payrollDueSelect.value = nextValue
}

function advanceToNextPayrollDue(completedRun){
  const normalizedSalaryType = normalizePayrollSalaryTypeLabel(completedRun?.salaryType || appSettings.payroll.salaryType)
  const currentDue = String(completedRun?.period || appSettings.payroll.due || "").trim()
  const options = getPayrollDueOptions(normalizedSalaryType)
  const currentIndex = options.findIndex((option) => option.value === currentDue)
  const nextOption = currentIndex >= 0 ? options[currentIndex + 1] : null

  if(!nextOption?.value){
    return null
  }

  appSettings.payroll.salaryType = normalizedSalaryType
  appSettings.payroll.due = nextOption.value
  appSettings.payroll.currentRunId = null
  appSettings.payroll.forceRegenerate = true
  resetPayrollApprovals()
  persistSettings()
  return {
    salaryType: normalizedSalaryType,
    due: nextOption.value,
    label: nextOption.label
  }
}

function getNextPaydayPayrollTotal(){
  const paydayDate = getPaydayDate(latestPayrollCalendarState)
  const salaryType = String(latestPayrollCalendarState?.salaryType || appSettings.payroll.calendarSalaryType || "Monthly")
  const payrollRuns = getPayrollRuns().filter((run) => String(run.salaryType || "") === salaryType)
  const normalizedSalaryType = normalizePayrollSalaryTypeLabel(salaryType)
  const targetPeriod = normalizedSalaryType === "Daily"
    ? formatDateKey(paydayDate)
    : normalizedSalaryType === "Weekly"
      ? getIsoWeekPeriodKey(paydayDate)
      : [
          paydayDate.getFullYear(),
          String(paydayDate.getMonth() + 1).padStart(2, "0")
        ].join("-")

  const matchingRuns = payrollRuns.filter((run) => String(run.period || "") === targetPeriod)
  if(matchingRuns.length){
    return matchingRuns.reduce((sum, run) => sum + Number(run.totals?.netPay || 0), 0)
  }

if(normalizedSalaryType === "Daily"){
  const dailyEmployees = getEmployeeRecords().filter((employee) =>
      employee.status === "ACTIVE" && String(employee.paymentType || employee.employmentType || "").toLowerCase() === "daily"
  )
  return dailyEmployees.reduce((sum, employee) => sum + Number(employee.salaryAmount || 0), 0)
}

if(normalizedSalaryType === "Weekly"){
  const weeklyEmployees = getEmployeeRecords().filter((employee) =>
      employee.status === "ACTIVE" && String(employee.paymentType || employee.employmentType || "").toLowerCase() === "weekly"
  )
  return weeklyEmployees.reduce((sum, employee) => sum + Number(employee.salaryAmount || 0), 0)
}

  const activeEmployees = getEmployeeRecords().filter((employee) =>
    employee.status === "ACTIVE" && String(employee.paymentType || employee.employmentType || "").toLowerCase() === "monthly"
  )
  return activeEmployees.reduce((sum, employee) => sum + Number(employee.salaryAmount || 0), 0)
}

function getOverviewTodaySummary(){
  const todayKey = getTodayDateKey()
  const activeEmployees = getEmployeeRecords().filter((employee) => employee.status === "ACTIVE")
  const todayLogs = getVisibleAttendanceLogRecords().filter((log) => String(log.date || "").slice(0, 10) === todayKey)
  const todayPresentEmployeeIds = new Set(todayLogs.map((log) => String(log.employeeId)))
  const onLeaveCount = getVisibleLeaveRequestRecords().filter((request) =>
    String(request.status || "").toLowerCase() === "active" &&
    isDateWithinRange(todayKey, String(request.fromDate || request.from || "").slice(0, 10), String(request.toDate || request.to || "").slice(0, 10))
  ).length
  const presentCount = todayPresentEmployeeIds.size
  const lateCount = todayLogs.filter((log) => String(log.checkIn || "") > "09:00").length
  const absentCount = Math.max(0, activeEmployees.length - presentCount - onLeaveCount)

  return {
    present: presentCount,
    absent: absentCount,
    onLeave: onLeaveCount,
    late: lateCount
  }
}

function renderOverviewPanels(){
  if(recentActivitiesList){
    const activities = (appSettings.activityHistory || []).slice(0, 4)
    recentActivitiesList.innerHTML = activities.length
      ? activities.map((item) => `<li>${item.title}${item.detail ? `: ${item.detail}` : ""}</li>`).join("")
      : `<li>No recent activity has been recorded yet.</li>`
  }

  if(upcomingActionsList){
    const pendingPayrollRuns = getPayrollRuns().filter((run) => run.status === "pending_approval" || run.status === "draft").length
    const pendingLeaveRequests = getVisibleLeaveRequestRecords().filter((request) => String(request.status || "").toLowerCase() === "pending").length
    const endingContracts = getVisibleContractRecords().filter((contract) => {
      const endDate = parseDateValue(contract.endDate || contract.contractDate || contract.date)
      if(!endDate){
        return false
      }

      const now = new Date()
      const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays >= 0 && diffDays <= 7
    }).length

    const actions = [
      pendingPayrollRuns ? `${pendingPayrollRuns} payroll run${pendingPayrollRuns === 1 ? "" : "s"} awaiting action` : null,
      pendingLeaveRequests ? `${pendingLeaveRequests} leave request${pendingLeaveRequests === 1 ? "" : "s"} pending approval` : null,
      endingContracts ? `${endingContracts} contract${endingContracts === 1 ? "" : "s"} ending this week` : null
    ].filter(Boolean)

    upcomingActionsList.innerHTML = actions.length
      ? actions.map((item) => `<li>${item}</li>`).join("")
      : `<li>No urgent actions are pending right now.</li>`
  }

  if(overviewSummaryMetrics){
    const summary = getOverviewTodaySummary()
    overviewSummaryMetrics.innerHTML = `
      <p><span>Present</span><strong>${summary.present}</strong></p>
      <p><span>Absent</span><strong>${summary.absent}</strong></p>
      <p><span>On Leave</span><strong>${summary.onLeave}</strong></p>
      <p><span>Late</span><strong>${summary.late}</strong></p>
    `
  }
}

async function syncOverviewDataFromBackend({ force = false, rerender = true } = {}){
  if(!hasLiveBackendSession() || !window.HexaPayApi){
    overviewSyncState.companyId = ""
    return null
  }

  const companyId = getActiveCompany()?.id
  if(!companyId){
    return null
  }

  if(!force && overviewSyncState.companyId === companyId){
    return null
  }

  if(overviewSyncState.inFlight){
    return overviewSyncState.inFlight
  }

  overviewSyncState.inFlight = (async () => {
    try{
      await window.HexaPayApi.getCompany?.()
      await window.HexaPayApi.getEmployees?.()
      await window.HexaPayApi.getDepartments?.()
      await Promise.all([
        window.HexaPayApi.getContracts?.(),
        window.HexaPayApi.getPayrollRuns?.(),
        window.HexaPayApi.getAttendanceLogs?.(),
        window.HexaPayApi.getLeaveRequests?.()
      ])
      overviewSyncState.companyId = companyId
      contractSyncState.companyId = companyId
      if(rerender){
        updateDashboardMetrics()
        renderWorkforceSection()
      }
      return true
    } catch (error){
      console.error("Failed to sync overview data from backend.", error)
      return null
    } finally {
      overviewSyncState.inFlight = null
    }
  })()

  return overviewSyncState.inFlight
}

async function syncContractsFromBackend({ force = false, rerender = true } = {}){
  if(!hasLiveBackendSession() || !window.HexaPayApi?.getContracts){
    contractSyncState.companyId = ""
    return null
  }

  const companyId = getActiveCompany()?.id
  if(!companyId){
    return null
  }

  if(!force && contractSyncState.companyId === companyId){
    return null
  }

  if(contractSyncState.inFlight){
    return contractSyncState.inFlight
  }

  contractSyncState.inFlight = (async () => {
    try{
      const contracts = await window.HexaPayApi.getContracts()
      contractSyncState.companyId = companyId
      if(rerender){
        renderContracts()
      }
      return contracts
    } catch (error){
      console.error("Failed to sync contracts from backend.", error)
      return null
    } finally {
      contractSyncState.inFlight = null
    }
  })()

  return contractSyncState.inFlight
}

function applyBackendOvertimeRatesToState(financialRules = []){
  const activeOvertimeRules = financialRules.filter((rule) =>
    String(rule?.rule_type || "").toLowerCase() === "overtime_rate" &&
    String(rule?.status || "active").toLowerCase() !== "inactive"
  )

  appSettings.worktrack.overtimeRates = activeOvertimeRules.map((rule) => {
    const departmentId = rule.target_id || ""
    const department = getDepartmentById(departmentId)
    return {
      id: rule.id,
      backendRuleId: rule.id,
      departmentId,
      department: department?.name || "Unknown Department",
      role: String(rule.name || "Team Member").trim(),
      rate: Number(rule.value || 0),
      updatedAt: String(rule.effective_from || rule.updated_at || new Date().toISOString()).slice(0, 10)
    }
  })
}

async function syncOvertimeRatesFromBackend({ force = false, rerender = true } = {}){
  if(!hasLiveBackendSession() || !window.HexaPayApi?.getFinancialRules){
    overtimeSyncState.companyId = ""
    return null
  }

  const companyId = getActiveCompany()?.id
  if(!companyId){
    return null
  }

  if(!force && overtimeSyncState.companyId === companyId){
    return null
  }

  if(overtimeSyncState.inFlight){
    return overtimeSyncState.inFlight
  }

  overtimeSyncState.inFlight = (async () => {
    try{
      await window.HexaPayApi.getDepartments?.()
      const payload = await window.HexaPayApi.getFinancialRules()
      applyBackendOvertimeRatesToState(payload?.financial_rules || [])
      overtimeSyncState.companyId = companyId
      if(rerender){
        renderOvertimeTab()
      }
      return payload
    } catch (error){
      console.error("Failed to sync overtime rates from backend.", error)
      return null
    } finally {
      overtimeSyncState.inFlight = null
    }
  })()

  return overtimeSyncState.inFlight
}

async function syncHolidaysFromBackend({ force = false, rerender = true } = {}){
  if(!hasLiveBackendSession() || !window.HexaPayApi?.getHolidays){
    holidaySyncState.companyId = ""
    return null
  }

  const companyId = getActiveCompany()?.id
  if(!companyId){
    return null
  }

  if(!force && holidaySyncState.companyId === companyId){
    return null
  }

  if(holidaySyncState.inFlight){
    return holidaySyncState.inFlight
  }

  holidaySyncState.inFlight = (async () => {
    try{
      const holidays = await window.HexaPayApi.getHolidays()
      holidaySyncState.companyId = companyId
      if(rerender){
        renderHolidayTab()
      }
      return holidays
    } catch (error){
      console.error("Failed to sync holidays from backend.", error)
      return null
    } finally {
      holidaySyncState.inFlight = null
    }
  })()

  return holidaySyncState.inFlight
}

function updateDashboardMetrics(){
  syncOverviewDataFromBackend()
  const employeeRecords = getEmployeeRecords()
  const activeEmployees = employeeRecords.filter((employee) => employee.status === "ACTIVE")
  const monthlyPayroll = getCurrentMonthPayrollTotal()
  const selectedPendingPayrollType = normalizePayrollSalaryTypeLabel(overviewPendingPayrollType)
  const payrollRunsById = new Map(
    getPayrollRuns().map((run) => [run.id, run])
  )
  const pendingPayroll = new Set(
    getPayrollItems()
      .filter((item) => {
        const payrollRun = payrollRunsById.get(item.runId)
        if(!payrollRun){
          return false
        }

        const normalizedStatus = String(payrollRun.status || "").trim().toLowerCase()
        const normalizedSalaryType = normalizePayrollSalaryTypeLabel(item.salaryType || payrollRun.salaryType)
        return normalizedStatus !== "rejected"
          && normalizedSalaryType === selectedPendingPayrollType
          && !Boolean(item.paid || item.signed)
      })
      .map((item) => String(item.employeeId || ""))
      .filter(Boolean)
  ).size

if(totalEmployeesValue){
  totalEmployeesValue.textContent = String(employeeRecords.length)
}

if(activeEmployeesValue){
  activeEmployeesValue.textContent = String(activeEmployees.length)
}

if(monthlyPayrollValue){
  const selectedCurrency = getSelectedSystemCurrency()
  const selectedFormatter = getCurrencyFormatter(selectedCurrency)
  const convertedPayroll = convertCurrencyAmount(monthlyPayroll, BASE_CURRENCY, selectedCurrency)
  monthlyPayrollValue.textContent = convertedPayroll === 0
    ? `${getCurrencyDisplayLabel(selectedCurrency)} 0`
    : selectedFormatter.format(convertedPayroll)
}

if(pendingPayrollValue){
  pendingPayrollValue.textContent = String(pendingPayroll)
}

if(pendingPayrollType){
  pendingPayrollType.value = selectedPendingPayrollType
}

renderOverviewCharts()
renderOverviewPanels()

  const activeCount = document.getElementById("activeCount")
  if(activeCount){
    activeCount.textContent = String(activeEmployees.length)
  }

  renderWorktrackSection()
  renderInsightsSection()
  renderFinancialsSection()
  }

function normalizeEmployeeFinancialProfile(profile){
return createEmployeeFinancialProfile(profile || {})
}

function getEmployeeLoanInstallmentDeduction(financialProfile){
const loan = normalizeEmployeeFinancialProfile(financialProfile).loan
if(!loan.enabled){
  return 0
}

const scheduledInstallment = Number(loan.installmentAmount || 0)
const balanceAmount = Number(loan.balanceAmount || 0)
const installmentsRemaining = Number(loan.installmentsRemaining || 0)

if(scheduledInstallment <= 0 || balanceAmount <= 0 || installmentsRemaining <= 0){
  return 0
}

return Math.min(balanceAmount, scheduledInstallment)
}

function calculateCompanyCustomDeductionsForSalary(salary){
const financialSettings = getEffectiveFinancialSettings()
return financialSettings.customDeductions.reduce((sum, item) => {
  if(item.type === "percentage"){
    return sum + Math.round(Number(salary || 0) * (Number(item.value || 0) / 100))
  }
  return sum + Number(item.value || 0)
}, 0)
}

function getEffectiveFinancialSettings(){
try{
  return appSettings?.financials || defaultFinancialsState
} catch (error){
  return defaultFinancialsState
}
}

function getEffectiveStatutoryConfiguration(){
  return normalizeStatutoryConfiguration(getEffectiveFinancialSettings().statutory || {})
}

function calculateCompensationFinancials({
salaryAmount,
financialProfile,
incentiveAmount = 0,
incentives = []
}){
const salary = Number(salaryAmount || 0)
const normalizedFinancialProfile = normalizeEmployeeFinancialProfile(financialProfile)
const statutory = getEffectiveStatutoryConfiguration()
const shouldApplyTaxFinancials = Boolean(normalizedFinancialProfile.applyTaxFinancials)
const normalizedIncentives = (Array.isArray(incentives) ? incentives : []).map((item) => ({
  label: item.name || item.type || "Incentive",
  amount: Number(item.amount || 0),
  taxable: item.taxable !== false,
  includedInGrossPay: true,
  category: String(item.incomeCategory || item.income_category || "bonus").trim() || "bonus"
}))
const normalizedIncentiveAmount = normalizedIncentives.length
  ? normalizedIncentives.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  : Number(incentiveAmount || 0)
const companyCustom = calculateCompanyCustomDeductionsForSalary(salary + normalizedIncentiveAmount)
const loanDeduction = getEmployeeLoanInstallmentDeduction(normalizedFinancialProfile)
const custom = companyCustom + loanDeduction
const incomeItems = [
  {
    label: "Basic Salary",
    amount: salary,
    taxable: true,
    includedInGrossPay: true,
    category: "basic_salary"
  },
  ...normalizedIncentives
]
const deductionPreview = calculatePayrollPreviewFromConfig({
  incomeItems,
  customDeductions: custom,
  config: statutory,
  enabled: {
    paye: shouldApplyTaxFinancials && normalizedFinancialProfile.statutory.paye,
    shif: shouldApplyTaxFinancials && normalizedFinancialProfile.statutory.shif,
    nssf: shouldApplyTaxFinancials && normalizedFinancialProfile.statutory.nssf,
    housingLevy: shouldApplyTaxFinancials && normalizedFinancialProfile.statutory.housingLevy
  }
})

return {
  salary,
  grossSalary: deductionPreview.grossSalary,
  taxablePay: deductionPreview.taxablePay,
  paye: deductionPreview.deductions.paye,
  shif: deductionPreview.deductions.shif,
  nssf: deductionPreview.deductions.nssf,
  housingLevy: deductionPreview.deductions.housingLevy,
  custom,
  companyCustom,
  loanDeduction,
  totalDeductions: deductionPreview.deductions.totalEmployeeDeductions,
  net: deductionPreview.netPay
}
}

function createSalaryHistory(salary, financialProfile = createEmployeeFinancialProfile()){
const values = calculateCompensationFinancials({
  salaryAmount: Number(salary || 0),
  financialProfile
})
return [
  { date: "2026-01-31", gross: salary, deductions: values.totalDeductions, allowance: 12000 },
  { date: "2026-02-28", gross: salary, deductions: values.totalDeductions, allowance: 12000 },
  { date: "2026-03-31", gross: salary, deductions: values.totalDeductions, allowance: 12000 }
]
}

function createEmployeeMeta(overrides = {}){
const salary = Number(overrides.salary || 0)
return {
  employeeNumber: String(overrides.employeeNumber || "").trim(),
  identification: overrides.identification || "ID-" + Math.floor(100000 + Math.random() * 899999),
  accountNumber: overrides.accountNumber || "0112" + Math.floor(100000 + Math.random() * 899999),
  accountDetails: overrides.accountDetails || "Equity Bank",
  role: overrides.role || "Team Member",
  salary,
  unpaidBalance: Number(overrides.unpaidBalance || 0),
  profileImage: overrides.profileImage || "",
  documents: overrides.documents || ["National ID.pdf", "NSSF Form.pdf", "Contract.pdf"],
  salaryHistory: Array.isArray(overrides.salaryHistory) ? overrides.salaryHistory : []
}
}

function setTaxFinancialButtonState(button, enabled){
if(!button) return
button.dataset.active = enabled ? "true" : "false"
button.textContent = enabled ? "Tax Financials Applied" : "Apply Tax Financials"
button.classList.toggle("is-active", enabled)
}

function setTaxFinancialVisibility(container, enabled){
if(!container) return
container.classList.toggle("is-hidden", !enabled)
}

function setLoanFieldsVisibility(container, enabled){
if(!container) return
container.classList.toggle("is-hidden", !enabled)
}

function resetEmployeeFinanceInputs(){
setTaxFinancialButtonState(empApplyTaxButton, false)
setTaxFinancialVisibility(empTaxOptions, false)
if(empApplyPaye){
  empApplyPaye.checked = true
}
if(empApplyShif){
  empApplyShif.checked = true
}
if(empApplyNssf){
  empApplyNssf.checked = true
}
if(empApplyHousingLevy){
  empApplyHousingLevy.checked = true
}
if(empLoanEnabled){
  empLoanEnabled.checked = false
}
setLoanFieldsVisibility(empLoanFields, false)
;[
  empLoanName,
  empLoanPrincipal,
  empLoanBalance,
  empLoanInstallment,
  empLoanInstallments,
  empLoanPaidInstallments,
  empLoanNextDate
].forEach((field) => {
  if(field){
    field.value = ""
  }
})
if(empLoanFrequency){
  empLoanFrequency.value = "Monthly"
}
}

function collectEmployeeFinancialProfileFromAddForm(){
return normalizeEmployeeFinancialProfile({
  applyTaxFinancials: empApplyTaxButton?.dataset.active === "true",
  statutory: {
    paye: Boolean(empApplyPaye?.checked),
    shif: Boolean(empApplyShif?.checked),
    nssf: Boolean(empApplyNssf?.checked),
    housingLevy: Boolean(empApplyHousingLevy?.checked)
  },
  loan: {
    enabled: Boolean(empLoanEnabled?.checked),
    name: empLoanName?.value.trim() || "",
    principalAmount: Number(empLoanPrincipal?.value || 0),
    balanceAmount: Number(empLoanBalance?.value || 0),
    installmentAmount: Number(empLoanInstallment?.value || 0),
    installmentFrequency: empLoanFrequency?.value || "Monthly",
    totalInstallments: Number(empLoanInstallments?.value || 0),
    installmentsPaid: Number(empLoanPaidInstallments?.value || 0),
    nextDeductionDate: empLoanNextDate?.value || ""
  }
})
}

function populateProfileFinancialControls(employee){
const financialProfile = normalizeEmployeeFinancialProfile(employee?.financialProfile)
setTaxFinancialButtonState(profileApplyTaxButton, financialProfile.applyTaxFinancials)
setTaxFinancialVisibility(profileTaxOptions, financialProfile.applyTaxFinancials)
if(profileApplyPaye){
  profileApplyPaye.checked = financialProfile.statutory.paye
}
if(profileApplyShif){
  profileApplyShif.checked = financialProfile.statutory.shif
}
if(profileApplyNssf){
  profileApplyNssf.checked = financialProfile.statutory.nssf
}
if(profileApplyHousingLevy){
  profileApplyHousingLevy.checked = financialProfile.statutory.housingLevy
}
if(profileLoanEnabled){
  profileLoanEnabled.checked = financialProfile.loan.enabled
}
setLoanFieldsVisibility(profileLoanFields, financialProfile.loan.enabled)
syncProfileSalaryInputs(employee?.salaryAmount || 0)
if(profileLoanName){
  profileLoanName.value = financialProfile.loan.name || ""
}
if(profileLoanPrincipal){
  profileLoanPrincipal.value = financialProfile.loan.principalAmount ? String(financialProfile.loan.principalAmount) : ""
}
if(profileLoanBalance){
  profileLoanBalance.value = financialProfile.loan.balanceAmount ? String(financialProfile.loan.balanceAmount) : ""
}
if(profileLoanInstallment){
  profileLoanInstallment.value = financialProfile.loan.installmentAmount ? String(financialProfile.loan.installmentAmount) : ""
}
if(profileLoanFrequency){
  profileLoanFrequency.value = financialProfile.loan.installmentFrequency || "Monthly"
}
if(profileLoanInstallments){
  profileLoanInstallments.value = financialProfile.loan.totalInstallments ? String(financialProfile.loan.totalInstallments) : ""
}
if(profileLoanPaidInstallments){
  profileLoanPaidInstallments.value = financialProfile.loan.installmentsPaid ? String(financialProfile.loan.installmentsPaid) : ""
}
if(profileLoanNextDate){
  profileLoanNextDate.value = financialProfile.loan.nextDeductionDate || ""
}

if(employeeFinancialSummary){
  const values = calculateEmployeeFinancials(employee)
  const taxState = financialProfile.applyTaxFinancials
    ? `PAYE ${financialProfile.statutory.paye ? "on" : "off"}, SHIF ${financialProfile.statutory.shif ? "on" : "off"}, NSSF ${financialProfile.statutory.nssf ? "on" : "off"}, Housing Levy ${financialProfile.statutory.housingLevy ? "on" : "off"}`
    : "No statutory tax deductions applied"
  const loanState = financialProfile.loan.enabled
    ? `Loan installment ${getCurrencyFormatter().format(values.loanDeduction || 0)} with ${financialProfile.loan.installmentsRemaining} installments remaining.`
    : "No salary loan deduction configured."
  employeeFinancialSummary.textContent = `${taxState}. ${loanState}`
}
}

function collectEmployeeFinancialProfileFromProfile(){
return normalizeEmployeeFinancialProfile({
  applyTaxFinancials: profileApplyTaxButton?.dataset.active === "true",
  statutory: {
    paye: Boolean(profileApplyPaye?.checked),
    shif: Boolean(profileApplyShif?.checked),
    nssf: Boolean(profileApplyNssf?.checked),
    housingLevy: Boolean(profileApplyHousingLevy?.checked)
  },
  loan: {
    enabled: Boolean(profileLoanEnabled?.checked),
    name: profileLoanName?.value.trim() || "",
    principalAmount: Number(profileLoanPrincipal?.value || 0),
    balanceAmount: Number(profileLoanBalance?.value || 0),
    installmentAmount: Number(profileLoanInstallment?.value || 0),
    installmentFrequency: profileLoanFrequency?.value || "Monthly",
    totalInstallments: Number(profileLoanInstallments?.value || 0),
    installmentsPaid: Number(profileLoanPaidInstallments?.value || 0),
    nextDeductionDate: profileLoanNextDate?.value || ""
  }
})
}

function getProfileSalaryAmount(fallbackAmount = 0){
const rawValue = profileEmpSalary?.value ?? profileSalaryEditor?.value ?? fallbackAmount
const nextSalaryAmount = Number(rawValue)
return Number.isFinite(nextSalaryAmount) && nextSalaryAmount >= 0 ? nextSalaryAmount : null
}

function syncProfileSalaryInputs(nextAmount){
const hasValue = nextAmount !== "" && nextAmount !== null && nextAmount !== undefined
const normalizedAmount = hasValue ? Number(nextAmount) : null
const nextValue = Number.isFinite(normalizedAmount) && normalizedAmount >= 0
  ? String(normalizedAmount)
  : ""

if(profileEmpSalary && profileEmpSalary.value !== nextValue){
  profileEmpSalary.value = nextValue
}
if(profileSalaryEditor && profileSalaryEditor.value !== nextValue){
  profileSalaryEditor.value = nextValue
}
}

function renderEmployeeProfile(employeeSource){
const employee = resolveEmployeeEntity(employeeSource) || getSelectedEmployee()
if(!employee) return

const meta = buildEmployeeMeta(employee)
const formatter = getCurrencyFormatter()

setAvatarPreview(profileEmployeeAvatar, selectedProfileEmployeeAvatar || meta.profileImage, "fa-solid fa-circle-user")

profileEmpName.value = employee.fullName
profileEmpIdentification.value = meta.identification
profileEmpAccountNumber.value = meta.accountNumber
profileEmpAccountDetails.value = meta.accountDetails
renderProfileEmployeeDepartmentOptions(employee.departmentId)
profileEmpRole.value = meta.role
profileEmpDate.value = employee.employmentDate
profileEmpType.value = employee.paymentType || employee.employmentType
syncEmployeePaymentBasisControl(
  profileEmpPaymentBasisRow,
  profileEmpPaymentBasis,
  employee.paymentType || employee.employmentType,
  employee.paymentBasis
)
syncProfileSalaryInputs(meta.salary || employee.salaryAmount || 0)
profileEmpUnpaidBalance.value = formatter.format(Number(meta.unpaidBalance || 0))
if(profileEmpPayrollNumber){
  profileEmpPayrollNumber.value = meta.employeeNumber || ""
}
populateProfileFinancialControls(employee)

renderEmployeeSalaryHistoryTable(employee, formatter)
void ensureEmployeePayrollHistoryLoaded(employee)
  .then(() => {
    const currentEmployee = getSelectedEmployee()
    if(currentEmployee && String(currentEmployee.id) === String(employee.id)){
      renderEmployeeSalaryHistoryTable(currentEmployee, getCurrencyFormatter())
    }
  })
  .catch((error) => {
    console.error("Failed to load actual employee salary history", error)
  })

profileDocumentsGrid.innerHTML = ""
  meta.documents.forEach((documentName) => {
    const doc = document.createElement("div")
  doc.className = "document-chip"
  doc.innerHTML = `<i class="fa-solid fa-file-pdf"></i><span>${documentName}</span>`
  profileDocumentsGrid.appendChild(doc)
  })
}

function getDepartmentMembers(departmentName){
const department = getDepartmentByName(departmentName)
if(!department){
  return []
}

return getEmployeeRecords().filter((employee) => String(employee.departmentId) === String(department.id))
}

function renderDepartmentCards(filterText = ""){
if(!departmentCards) return

  const search = filterText.trim().toLowerCase()
  departmentCards.innerHTML = ""

  const departments = getAvailableDepartments().filter((department) => department.name.toLowerCase().includes(search))

  if(selectedDepartmentId && !departments.some((department) => String(department.id) === String(selectedDepartmentId))){
    selectedDepartmentId = departments[0]?.id || null
  }

  departments.forEach((department) => {
    const actualMembers = getDepartmentMembers(department.name)
    const employeeCount = actualMembers.length || department.employeeCount
    const roleCount = getDepartmentRoleCount(department)
    const card = document.createElement("article")
    card.className = "department-card" + (department.id === selectedDepartmentId ? " active" : "")
    card.innerHTML = `
      <div class="department-card-icon"><i class="${getDepartmentIconClass(department.icon)}"></i></div>
      <h3>${department.name}</h3>
      <p>Roles: ${roleCount}</p>
      <p>Employees: ${employeeCount}</p>
    `
  card.addEventListener("click", () => {
    selectedDepartmentId = department.id
    renderDepartmentCards(search)
  })
  card.addEventListener("dblclick", () => {
    selectedDepartmentId = department.id
    openDepartmentProfile()
  })
  departmentCards.appendChild(card)
  })

  if(departmentCount){
    departmentCount.textContent = String(getAvailableDepartments().length)
  }

  if(!selectedDepartmentId && departments.length){
    selectedDepartmentId = departments[0].id
  }
}

function setOverlayOpenState(overlay, isOpen, { lockBody = false } = {}){
  if(!overlay) return

  overlay.classList.toggle("open", isOpen)
  overlay.setAttribute("aria-hidden", isOpen ? "false" : "true")
  overlay.style.pointerEvents = isOpen ? "auto" : "none"
  overlay.style.visibility = isOpen ? "visible" : "hidden"
  overlay.style.display = isOpen ? "flex" : "none"

  if(lockBody){
    document.body.style.overflow = isOpen ? "hidden" : ""
  }
}

function closeAllOverlayWindows(){
  ;[
    settingsWindow,
    notificationsWindow,
    profileWindow,
    employeeModal,
    employeeProfileWindow,
    departmentModal,
    departmentProfileWindow,
    departmentDeleteConfirmWindow,
    contractModal,
    contractProfileWindow
  ].forEach((overlay) => setOverlayOpenState(overlay, false))

  document.body.style.overflow = ""
}

let textPromptWindow = null
let textPromptTitle = null
let textPromptMessage = null
let textPromptInput = null
let textPromptError = null
let textPromptConfirmButton = null
let textPromptCancelButton = null
let activeTextPromptResolver = null

function ensureTextPromptWindow(){
  if(textPromptWindow || !document.body){
    return
  }

  const promptWindow = document.createElement("div")
  promptWindow.className = "settings-window text-prompt-window"
  promptWindow.setAttribute("aria-hidden", "true")
  promptWindow.innerHTML = `
    <div class="settings-panel text-prompt-panel" role="dialog" aria-modal="true">
      <div class="text-prompt-header">
        <h3 class="text-prompt-title">Enter a value</h3>
      </div>
      <p class="text-prompt-message"></p>
      <textarea class="text-prompt-input" rows="4"></textarea>
      <div class="text-prompt-error" aria-live="polite"></div>
      <div class="employee-modal-actions text-prompt-actions">
        <button type="button" class="secondary-button text-prompt-cancel">Cancel</button>
        <button type="button" class="employee-submit-button text-prompt-confirm">Continue</button>
      </div>
    </div>
  `

  document.body.appendChild(promptWindow)

  textPromptWindow = promptWindow
  textPromptTitle = promptWindow.querySelector(".text-prompt-title")
  textPromptMessage = promptWindow.querySelector(".text-prompt-message")
  textPromptInput = promptWindow.querySelector(".text-prompt-input")
  textPromptError = promptWindow.querySelector(".text-prompt-error")
  textPromptConfirmButton = promptWindow.querySelector(".text-prompt-confirm")
  textPromptCancelButton = promptWindow.querySelector(".text-prompt-cancel")

  const closePrompt = (value = null) => {
    if(!activeTextPromptResolver){
      setOverlayOpenState(textPromptWindow, false, { lockBody: true })
      return
    }

    const resolver = activeTextPromptResolver
    activeTextPromptResolver = null
    setOverlayOpenState(textPromptWindow, false, { lockBody: true })
    textPromptInput.value = ""
    textPromptError.textContent = ""
    resolver(value)
  }

  textPromptCancelButton?.addEventListener("click", () => closePrompt(null))
  textPromptWindow.addEventListener("click", (event) => {
    if(event.target === textPromptWindow){
      closePrompt(null)
    }
  })
  textPromptConfirmButton?.addEventListener("click", () => closePrompt(textPromptInput.value))
  textPromptInput?.addEventListener("keydown", (event) => {
    if(event.key === "Escape"){
      event.preventDefault()
      closePrompt(null)
      return
    }

    if((event.ctrlKey || event.metaKey) && event.key === "Enter"){
      event.preventDefault()
      closePrompt(textPromptInput.value)
    }
  })
}

async function requestTextInput({
  title = "Enter a value",
  message = "",
  placeholder = "",
  defaultValue = "",
  submitLabel = "Continue",
  allowEmpty = true
} = {}){
  ensureTextPromptWindow()
  if(!textPromptWindow){
    return null
  }

  if(activeTextPromptResolver){
    activeTextPromptResolver(null)
    activeTextPromptResolver = null
  }

  textPromptTitle.textContent = title
  textPromptMessage.textContent = message
  textPromptInput.value = defaultValue
  textPromptInput.placeholder = placeholder
  textPromptConfirmButton.textContent = submitLabel
  textPromptError.textContent = ""

  return new Promise((resolve) => {
    activeTextPromptResolver = (value) => {
      if(value === null){
        resolve(null)
        return
      }

      const normalizedValue = String(value)
      if(!allowEmpty && !normalizedValue.trim()){
        textPromptError.textContent = "This field cannot be empty."
        setOverlayOpenState(textPromptWindow, true, { lockBody: true })
        window.setTimeout(() => textPromptInput?.focus(), 0)
        return
      }

      resolve(normalizedValue.trim())
    }

    setOverlayOpenState(textPromptWindow, true, { lockBody: true })
    window.setTimeout(() => {
      textPromptInput?.focus()
      textPromptInput?.select()
    }, 0)
  })
}

function openDepartmentModal(editing = false){
if(!departmentModal) return

closeAllOverlayWindows()

  isEditingDepartment = editing
const department = getDepartmentById(selectedDepartmentId)
  departmentModalTitle.textContent = editing ? "Edit Department" : "Add Department"
departmentSaveButton.textContent = editing ? "Save" : "Add"

departmentNameInput.value = editing && department ? department.name : ""
departmentNotesInput.value = editing && department ? department.notes : ""
selectedDepartmentIcon = editing && department ? (department.icon || "fa-building") : "fa-building"
renderDepartmentAvatarPreview()
renderDepartmentIconLibrary()
if(departmentDeleteButton){
  departmentDeleteButton.style.display = editing ? "inline-flex" : "none"
}

setOverlayOpenState(departmentModal, true)
window.setTimeout(() => {
  departmentNameInput?.focus()
}, 0)
}

function closeDepartmentModal(){
setOverlayOpenState(departmentModal, false)
}

function openDepartmentDeleteConfirm(){
setOverlayOpenState(departmentDeleteConfirmWindow, true)
}

function closeDepartmentDeleteConfirm(){
setOverlayOpenState(departmentDeleteConfirmWindow, false)
}

function openDepartmentProfile(){
const department = getDepartmentById(selectedDepartmentId)
if(!department || !departmentProfileWindow) return
closeAllOverlayWindows()

departmentProfileName.textContent = department.name
departmentMembersBody.innerHTML = ""

const members = getDepartmentMembers(department.name)
const formatter = getCurrencyFormatter()

members.forEach((employee, index) => {
  const meta = buildEmployeeMeta(employee)
  const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${employee.fullName}</td>
      <td>${meta.role}</td>
      <td>${formatUiDate(employee.employmentDate)}</td>
      <td>${employee.status}</td>
    `
  departmentMembersBody.appendChild(tr)
})

if(!members.length){
  const tr = document.createElement("tr")
  tr.innerHTML = `<td>1</td><td>${department.hod}</td><td>HOD</td><td>2026-01-30</td><td>Active</td>`
  departmentMembersBody.appendChild(tr)
}

assignHodButton.textContent = department.hod ? `HOD: ${department.hod}` : "Assign HOD"
assignRoleSelect.value = "Assign Role"
setOverlayOpenState(departmentProfileWindow, true)
}

function closeDepartmentProfile(){
setOverlayOpenState(departmentProfileWindow, false)
}

function getContractStatusClass(status){
switch(status){
  case "Active":
    return "active"
  case "Pending":
    return "resign"
  case "Completed":
    return "retired"
  case "Resigned":
    return "resign"
  case "Terminated":
    return "fired"
  default:
    return "active"
}
}

function getFilteredContracts(){
let contracts = [...getVisibleContractRecords()]
const search = contractSearchInput?.value.trim().toLowerCase() || ""
const typeValue = contractTypeFilter?.value || ""
const dateValue = contractStartFilter?.value || ""
const statusValue = contractStatusFilter?.value || ""
const sortValue = contractSortFilter?.value || ""

if(search){
  contracts = contracts.filter((contract) =>
    contract.partyName.toLowerCase().includes(search) ||
    contract.companyName.toLowerCase().includes(search) ||
    contract.contractNumber.toLowerCase().includes(search)
  )
}

if(typeValue){
  contracts = contracts.filter((contract) => contract.contractType === typeValue)
}

if(dateValue){
  contracts = contracts.filter((contract) => contract.contractDate.startsWith(dateValue))
}

if(statusValue){
  contracts = contracts.filter((contract) => contract.status === statusValue)
}

if(sortValue === "name"){
  contracts.sort((a, b) => a.partyName.localeCompare(b.partyName))
} else if(sortValue === "date"){
  contracts.sort((a, b) => a.contractDate.localeCompare(b.contractDate))
} else if(sortValue === "status"){
  contracts.sort((a, b) => a.status.localeCompare(b.status))
}

return contracts
}

function renderContractActionButtons(){
  const hasSelection = Boolean(getContractById(selectedContractId))

  if(editContractBtn){
    editContractBtn.disabled = !hasSelection
    editContractBtn.classList.toggle("btn-disabled", !hasSelection)
  }

  if(deleteContractBtn){
    deleteContractBtn.disabled = !hasSelection
    deleteContractBtn.classList.toggle("btn-disabled", !hasSelection)
  }
}

function renderContracts(){
if(!contractTableBody) return
syncContractsFromBackend()

const contracts = getFilteredContracts()
if(selectedContractId && !getContractById(selectedContractId)){
  selectedContractId = contracts[0]?.id || null
  appState.contracts.selectedContractId = selectedContractId
}
contractTableBody.innerHTML = ""

if(!contracts.length){
  contractTableBody.innerHTML = `<tr><td colspan="5">No contracts match the current filters.</td></tr>`
  renderContractActionButtons()
  return
}

contracts.forEach((contract, index) => {
  const tr = document.createElement("tr")
  tr.className = contract.id === selectedContractId ? "selected" : ""
  tr.innerHTML = `
    <td>${index + 1}</td>
    <td>${contract.partyName}</td>
    <td>${contract.contractType}</td>
    <td>${contract.contractDate}</td>
    <td><span class="status ${getContractStatusClass(contract.status)}">${contract.status}</span></td>
  `
  tr.addEventListener("click", () => {
    selectedContractId = contract.id
    appState.contracts.selectedContractId = contract.id
    renderContracts()
  })
  tr.addEventListener("dblclick", () => {
    selectedContractId = contract.id
    appState.contracts.selectedContractId = contract.id
    openContractProfile()
  })
  contractTableBody.appendChild(tr)
})

renderContractActionButtons()
}

function openContractModal(editing = false){
if(!contractModal) return
closeAllOverlayWindows()

isEditingContract = editing
const contract = getContractById(selectedContractId)
selectedContractDocuments = editing && contract ? [...(contract.documents || [])] : []
contractModalTitle.textContent = editing ? "Edit Contract" : "Add Contract"
contractSaveButton.textContent = editing ? "Save" : "Add"

contractNameInput.value = editing && contract ? contract.partyName : ""
contractNumberInput.value = editing && contract ? contract.contractNumber : `CNT-${Math.floor(1000 + Math.random() * 9000)}`
contractAccountNumberInput.value = editing && contract ? contract.accountNumber : ""
contractAccountDetailsInput.value = editing && contract ? contract.accountDetails : ""
contractCompanyInput.value = editing && contract ? contract.companyName : appSettings.company.name
contractRoleInput.value = editing && contract ? contract.roleTitle : ""
contractDateInput.value = editing && contract ? contract.contractDate : "2026-03-28"
contractTypeInput.value = editing && contract ? contract.contractType : "Internship"
contractPaymentInput.value = editing && contract ? contract.totalPayment : "45000"
if(contractDocumentsInput){
  contractDocumentsInput.value = ""
}
if(contractStatusActions){
  contractStatusActions.style.display = editing ? "grid" : "none"
}
renderSelectedDocumentPreview(contractDocumentsPreview, selectedContractDocuments)

setOverlayOpenState(contractModal, true)
}

function closeContractModal(){
setOverlayOpenState(contractModal, false)
}

function openContractProfile(){
const contract = getContractById(selectedContractId)
if(!contract || !contractProfileWindow) return
closeAllOverlayWindows()

const formatter = getCurrencyFormatter()
profileContractName.value = contract.partyName
profileContractNumber.value = contract.contractNumber
profileContractAccountNumber.value = contract.accountNumber
profileContractAccountDetails.value = contract.accountDetails
profileContractCompany.value = contract.companyName
profileContractRole.value = contract.roleTitle
profileContractDate.value = contract.contractDate
profileContractType.value = contract.contractType
profileContractPayment.value = formatter.format(contract.totalPayment)
profileContractBalance.value = formatter.format(contract.balance)

contractPaymentHistoryBody.innerHTML = ""
contractDocumentsGrid.innerHTML = ""
contract.documents.forEach((documentName) => {
  const doc = document.createElement("div")
  doc.className = "document-chip"
  doc.innerHTML = `<i class="fa-solid fa-file-pdf"></i><span>${documentName}</span>`
  contractDocumentsGrid.appendChild(doc)
})

const paymentHistory = contract.paymentHistory.length
  ? contract.paymentHistory
  : [{ date: contract.contractDate, deductions: 0, payment: Math.round(contract.totalPayment * 0.4) }]

paymentHistory.forEach((entry) => {
  const tr = document.createElement("tr")
  tr.innerHTML = `
    <td>${entry.date}</td>
    <td>${formatter.format(entry.deductions)}</td>
    <td>${formatter.format(entry.payment)}</td>
  `
  contractPaymentHistoryBody.appendChild(tr)
})

setOverlayOpenState(contractProfileWindow, true)
}

function closeContractProfile(){
setOverlayOpenState(contractProfileWindow, false)
}

async function updateContractStatus(status){
const contract = getContractById(selectedContractId)
if(!contract) return
try{
  const updatedContract = await window.HexaPayApi.updateContract(selectedContractId, {
    status
  })
  selectedContractId = updatedContract?.id || selectedContractId
  appState.contracts.selectedContractId = selectedContractId
  renderContracts()
  openContractProfile()
  addActivity("Contract updated", `${contract.partyName} contract marked as ${status}.`)
} catch (error){
  console.error("Failed to update contract status.", error)
  window.alert(error?.payload?.error?.message || error?.message || "Contract status could not be updated.")
}
}

window.updateContractStatus = updateContractStatus

async function updateEditingContractStatus(status){
  if(!selectedContractId){
    return
  }

  await updateContractStatus(status)
  const updatedContract = getContractById(selectedContractId)
  if(updatedContract){
    openContractModal(true)
  }
}

window.updateEditingContractStatus = updateEditingContractStatus

function resetPayrollApprovals(){
  syncApprovalTemplatesForState(appState)
  appSettings.payroll.approvals = (appSettings.payroll.approvals || []).map((approval) => ({
    ...approval,
    approved: false,
    status: "pending",
    approvedAt: null,
    rejectedAt: null,
    rejectionReason: ""
  }))
  }

function preparePayrollSelectionChange(){
  appSettings.payroll.currentRunId = null
  appSettings.payroll.forceRegenerate = false
}

async function resetStructureApprovals(){
  syncApprovalTemplatesForState(appState)
  if(!window.HexaPayApi?.resetPayrollStructureApprovalState){
    appSettings.payroll.structureApprovals = (appSettings.payroll.structureApprovals || []).map((approval) => ({
      ...approval,
      approved: false,
      status: "pending",
      approvedAt: null,
      rejectedAt: null,
      rejectionReason: ""
    }))
    return null
  }

  return window.HexaPayApi.resetPayrollStructureApprovalState()
  }

async function resetCalendarApprovals(){
  syncApprovalTemplatesForState(appState)
  if(!window.HexaPayApi?.resetPayrollCalendarApprovalState){
    appSettings.payroll.calendarApprovals = (appSettings.payroll.calendarApprovals || []).map((approval) => ({
      ...approval,
      approved: false,
      status: "pending",
      approvedAt: null,
      rejectedAt: null,
      rejectionReason: ""
    }))
    return null
  }

  return window.HexaPayApi.resetPayrollCalendarApprovalState()
  }

function getPayrollDailyRate(employee, meta){
const salaryValue = employee?.salaryAmount ?? meta?.salary ?? 0
const paymentType = String(employee?.paymentType || employee?.employmentType || "").trim().toLowerCase()
if(paymentType === "daily"){
  return Number(salaryValue)
}
if(paymentType === "weekly"){
  return Number((Number(salaryValue) / 7).toFixed(2))
}
return Number((Number(salaryValue) / 30).toFixed(2))
}

function getDaysAttended(name){
const base = name.length % 6
return 4 + base
}

function getPayrollAttendanceStatusLabel(payrollItem, employee){
  const paymentType = String(employee?.paymentType || employee?.employmentType || "").trim().toLowerCase()
  const paymentBasis = normalizeEmployeePaymentBasisValue(paymentType, employee?.paymentBasis)
  const attendanceDays = Number(payrollItem?.attendanceDays || 0)

  if(paymentType === "daily" || paymentBasis === "attendance_dependent"){
    return `${attendanceDays} day${attendanceDays === 1 ? "" : "s"}`
  }

  return Boolean(payrollItem?.paid || payrollItem?.signed) ? "Paid" : "Standard"
}

async function openPayrollTab(tabId, options = {}){
  syncTargetedNavigation({
    triggerSelector: "[data-payroll-tab-target]",
    triggerAttribute: "data-payroll-tab-target",
    panelSelector: ".payroll-tab-content",
    panelActiveClass: "active-payroll-tab",
    activePanelId: tabId
  })
  appSettings.payroll.activeTab = tabId
  persistSettings()

  if(tabId === "payrollRun"){
    await renderPayrollRun(options.payrollPayload || null)
  }

  if(tabId === "payrollHistory"){
    await renderPayrollHistory()
  }

  if(tabId === "payrollStructure"){
    await renderPayrollStructure()
  }

  if(tabId === "payrollCalendar"){
    await renderPayCalendar()
  }

  scrollContentToTop(tabId)
  }

function renderPayrollDepartmentOptions(){
  if(!payrollDepartmentFilter) return

  const departments = getPayrollDepartmentsForSalaryType(appSettings.payroll.salaryType)
  const currentValue = resolvePayrollDepartmentSelectionId(appSettings.payroll.department, departments)
  payrollDepartmentFilter.innerHTML = `<option value="">All Departments</option>`
  departments.forEach((department) => {
    const option = document.createElement("option")
    option.value = department.id
    option.textContent = department.name
    payrollDepartmentFilter.appendChild(option)
  })
  appSettings.payroll.department = currentValue
  payrollDepartmentFilter.value = currentValue
}

function renderPayrollStructureDepartmentOptions(){
  if(!structureDepartmentFilter) return

  const currentValue = appSettings.payroll.structureDepartment || ""
  structureDepartmentFilter.innerHTML = `<option value="">All Departments</option>`
  appSettings.departments.forEach((department) => {
    const option = document.createElement("option")
    option.value = department.name
    option.textContent = department.name
    structureDepartmentFilter.appendChild(option)
  })
  structureDepartmentFilter.value = currentValue
  }

async function renderPayrollApprovals(run = null){
  if(!payrollApprovals) return

let currentRun = run
if(!currentRun && appSettings.payroll.currentRunId){
  try{
    const payload = await window.HexaPayApi.getPayrollRun(appSettings.payroll.currentRunId)
    currentRun = payload.run
  } catch (error){
    console.error("Failed to load payroll approvals", error)
  }
}

const currentUser = getCurrentAuthUserFromState(appState)
payrollApprovals.innerHTML = ""

if(!currentRun){
  payrollApprovals.innerHTML = `<div class="structure-empty-state">Generate a payroll run to start approvals.</div>`
  if(printPayrollPdfButton){
    printPayrollPdfButton.disabled = true
  }
  return
}

currentRun.approvals.forEach((approval, index) => {
  const card = document.createElement("div")
  card.className = "payroll-approval-card"
  const canApprove = currentUser?.id === approval.approverId && approval.status === "pending"
  const buttonLabel = approval.status === "approved"
    ? "Approved"
    : approval.status === "rejected"
      ? "Rejected"
      : canApprove
        ? "Approve"
        : "Pending Approval"
  card.innerHTML = `
    <strong>${approval.approverName}</strong>
    <span>${approval.role}${approval.rejectionReason ? ` • ${approval.rejectionReason}` : ""}</span>
    <div class="approve-actions">
      <button class="approve-button${approval.status === "approved" ? " approved" : ""}" data-approval-index="${index}" data-approval-action="approve" ${canApprove ? "" : "disabled"}>
        ${buttonLabel}
      </button>
      <button class="approve-button reject-button${approval.status === "rejected" ? " rejected" : ""}" data-approval-index="${index}" data-approval-action="reject" ${canApprove ? "" : "disabled"}>
        ${approval.status === "rejected" ? "Rejected" : "Reject"}
      </button>
    </div>
  `
  payrollApprovals.appendChild(card)
})

const allApproved = currentRun.status === "approved" || currentRun.status === "posted"
  if(printPayrollPdfButton){
    printPayrollPdfButton.disabled = !allApproved
  }
  }

function populatePaydaySelectors(){
  const previousMonthValue = String(paydayMonthSelect?.value || appSettings.payroll.paydayMonth || getCurrentPayrollMonthKey())
  const previousDayValue = String(paydayDaySelect?.value || appSettings.payroll.paydayDay || getCurrentPayrollDayNumber())

  if(paydayMonthSelect){
    paydayMonthSelect.innerHTML = ""
    const currentDate = new Date()
    for(let offset = 0; offset < 12; offset += 1){
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
      const option = document.createElement("option")
      option.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      option.textContent = date.toLocaleDateString("en-KE", { month: "long", year: "numeric" })
      paydayMonthSelect.appendChild(option)
    }
  }

  const normalizedSelection = getNormalizedPaydaySelection(previousMonthValue, previousDayValue)

  if(paydayMonthSelect){
    paydayMonthSelect.value = Array.from(paydayMonthSelect.options).some((option) => option.value === normalizedSelection.paydayMonth)
      ? normalizedSelection.paydayMonth
      : paydayMonthSelect.options[0]?.value || getCurrentPayrollMonthKey()
  }

  const selectedMonthValue = String(paydayMonthSelect?.value || normalizedSelection.paydayMonth)
  const [selectedYear, selectedMonth] = selectedMonthValue.split("-").map(Number)
  const maxDay = new Date(selectedYear, selectedMonth, 0).getDate()
  const minimumDay = selectedMonthValue === getTomorrowDateKey().slice(0, 7) ? Number(getTomorrowDateKey().slice(8, 10)) : 1

  if(paydayDaySelect){
    paydayDaySelect.innerHTML = ""
    for(let day = minimumDay; day <= maxDay; day += 1){
      const option = document.createElement("option")
      option.value = String(day)
      option.textContent = `${day}`
      paydayDaySelect.appendChild(option)
    }
    const normalizedDay = getNormalizedPaydaySelection(selectedMonthValue, normalizedSelection.paydayDay).paydayDay
    paydayDaySelect.value = normalizedDay
  }

  appSettings.payroll.paydayMonth = selectedMonthValue
  appSettings.payroll.paydayDay = String(paydayDaySelect?.value || normalizedSelection.paydayDay)
}

function syncPayrollCalendarWorkspace(calendarState){
  if(!calendarState){
    return
  }

  appSettings.payroll.calendarSalaryType = calendarState.salaryType || appSettings.payroll.calendarSalaryType || "Monthly"
  const scheduleKey = String(appSettings.payroll.calendarSalaryType || "Monthly").trim().toLowerCase() === "weekly"
    ? "weekly"
    : "monthly"
  const selectedSchedule = calendarState.schedules?.[scheduleKey] || calendarState
  const normalizedSelection = getNormalizedPaydaySelection(
    selectedSchedule.paydayMonth || selectedSchedule.payday_month || appSettings.payroll.paydayMonth || getCurrentPayrollMonthKey(),
    selectedSchedule.paydayDay || selectedSchedule.payday_day || appSettings.payroll.paydayDay || getCurrentPayrollDayNumber()
  )
  appSettings.payroll.paydayDay = normalizedSelection.paydayDay
  appSettings.payroll.paydayMonth = normalizedSelection.paydayMonth
  appSettings.payroll.calendarDraftDirty = false
}

function getCalendarScheduleKey(salaryTypeValue = appSettings.payroll.calendarSalaryType){
  return String(salaryTypeValue || "Monthly").trim().toLowerCase() === "weekly"
    ? "weekly"
    : "monthly"
}

function syncCalendarWorkspaceForType(calendarState, salaryTypeValue = appSettings.payroll.calendarSalaryType){
  const scheduleKey = getCalendarScheduleKey(salaryTypeValue)
  appSettings.payroll.calendarSalaryType = normalizePayrollSalaryTypeLabel(salaryTypeValue)
  const selectedSchedule = calendarState?.schedules?.[scheduleKey] || calendarState
  const normalizedSelection = getNormalizedPaydaySelection(
    selectedSchedule?.paydayMonth || selectedSchedule?.payday_month || appSettings.payroll.paydayMonth || getCurrentPayrollMonthKey(),
    selectedSchedule?.paydayDay || selectedSchedule?.payday_day || appSettings.payroll.paydayDay || getCurrentPayrollDayNumber()
  )
  appSettings.payroll.paydayDay = normalizedSelection.paydayDay
  appSettings.payroll.paydayMonth = normalizedSelection.paydayMonth
  appSettings.payroll.calendarDraftDirty = false
}

function getCalendarRenderState(calendarState){
  const baseState = calendarState
    ? structuredClone(calendarState)
    : {
        salaryType: appSettings.payroll.calendarSalaryType || "Monthly",
        paydayDay: appSettings.payroll.paydayDay || String(getCurrentPayrollDayNumber()),
        paydayMonth: appSettings.payroll.paydayMonth || getCurrentPayrollMonthKey(),
        schedules: {}
      }

  baseState.schedules = baseState.schedules || {}

  if(!appSettings.payroll.calendarDraftDirty){
    return baseState
  }

  const scheduleKey = getCalendarScheduleKey(appSettings.payroll.calendarSalaryType)
  baseState.salaryType = appSettings.payroll.calendarSalaryType || baseState.salaryType || "Monthly"
  baseState.paydayDay = appSettings.payroll.paydayDay
  baseState.paydayMonth = appSettings.payroll.paydayMonth
  baseState.schedules[scheduleKey] = {
    ...(baseState.schedules[scheduleKey] || {}),
    paydayDay: appSettings.payroll.paydayDay,
    paydayMonth: appSettings.payroll.paydayMonth,
    payday_day: appSettings.payroll.paydayDay,
    payday_month: appSettings.payroll.paydayMonth
  }

  return baseState
}

function getPaydayDateFromSchedule(schedule){
  if(!schedule){
    return null
  }

  const normalizedSelection = getNormalizedPaydaySelection(
    schedule.paydayMonth || schedule.payday_month || getCurrentPayrollMonthKey(),
    schedule.paydayDay || schedule.payday_day || getCurrentPayrollDayNumber()
  )
  const [year, month] = normalizedSelection.paydayMonth.split("-").map(Number)
  const requestedDay = Number(normalizedSelection.paydayDay || 1)
  const maxDay = new Date(year, month, 0).getDate()
  return new Date(year, month - 1, Math.min(requestedDay, maxDay))
}

function getPaydayDate(calendarState = null){
  const selectedSalaryType = String(
    calendarState?.salaryType || appSettings.payroll.calendarSalaryType || "Monthly"
  ).trim().toLowerCase()
  const selectedSchedule = calendarState?.schedules?.[selectedSalaryType === "weekly" ? "weekly" : "monthly"] || calendarState || {
    paydayMonth: appSettings.payroll.paydayMonth || getCurrentPayrollMonthKey(),
    paydayDay: appSettings.payroll.paydayDay || getCurrentPayrollDayNumber()
  }
  return getPaydayDateFromSchedule(selectedSchedule)
}

async function renderCalendarApprovals(approvalState = null){
  if(!calendarApprovals) return

  let currentApprovalState = approvalState
  if(!currentApprovalState){
    try{
      currentApprovalState = await window.HexaPayApi.getPayrollCalendarApprovalState()
    } catch (error){
      console.error("Failed to load payroll calendar approvals", error)
    }
  }

  const currentUser = getCurrentAuthUserFromState(appState)
  calendarApprovals.innerHTML = ""

  if(!currentApprovalState){
    calendarApprovals.innerHTML = `<div class="structure-empty-state">Calendar approvals are unavailable right now.</div>`
    return
  }

  currentApprovalState.approvals.forEach((approval, index) => {
    const canApprove = currentUser?.id === approval.approverId && approval.status === "pending"
    const buttonLabel = approval.status === "approved"
      ? "Approved"
      : approval.status === "rejected"
        ? "Rejected"
        : canApprove
          ? "Approve"
          : "Pending Approval"
    const card = document.createElement("div")
    card.className = "payroll-approval-card"
    card.innerHTML = `
      <strong>${approval.role}</strong>
      <span>${approval.approverName}${approval.rejectionReason ? ` • ${approval.rejectionReason}` : ""}</span>
      <div class="approve-actions">
        <button class="approve-button${approval.status === "approved" ? " approved" : ""}" data-calendar-approval-index="${index}" data-calendar-action="approve" ${canApprove ? "" : "disabled"}>
          ${buttonLabel}
        </button>
        <button class="approve-button reject-button${approval.status === "rejected" ? " rejected" : ""}" data-calendar-approval-index="${index}" data-calendar-action="reject" ${canApprove ? "" : "disabled"}>
          ${approval.status === "rejected" ? "Rejected" : "Reject"}
        </button>
      </div>
    `
    calendarApprovals.appendChild(card)
  })
  }

async function renderPayCalendar(){
  populatePaydaySelectors()

  let approvalState = latestPayrollCalendarState
  try{
    approvalState = await window.HexaPayApi.getPayrollCalendarApprovalState()
    latestPayrollCalendarState = approvalState
  } catch (error){
    console.error("Failed to load payroll calendar approval state", error)
    latestPayrollCalendarState = null
  }

  if(approvalState){
    if(!appSettings.payroll.calendarDraftDirty){
      syncPayrollCalendarWorkspace(approvalState)
    }
  }

  const renderState = getCalendarRenderState(approvalState)

  if(calendarSalaryType){
    calendarSalaryType.value = appSettings.payroll.calendarSalaryType || "Monthly"
  }
  if(paydayDaySelect){
    paydayDaySelect.value = appSettings.payroll.paydayDay || String(getCurrentPayrollDayNumber())
  }
  if(paydayMonthSelect){
    paydayMonthSelect.value = appSettings.payroll.paydayMonth || getCurrentPayrollMonthKey()
  }

  const paydayDate = getPaydayDate(renderState)
  const calendarYear = paydayDate.getFullYear()
  const formatter = new Intl.DateTimeFormat("en-KE", { month: "long", day: "numeric", year: "numeric" })
  const allApproved = renderState?.status === "approved"
  const isRejected = renderState?.status === "rejected"
  const monthlyPaydayDate = getPaydayDateFromSchedule(renderState?.schedules?.monthly)
  const weeklyPaydayDate = getPaydayDateFromSchedule(renderState?.schedules?.weekly)

  if(calendarYearLabel){
    calendarYearLabel.textContent = String(calendarYear)
  }

  if(calendarNextPayday){
    calendarNextPayday.textContent = `${formatter.format(paydayDate)} is scheduled as the next ${(renderState?.salaryType || appSettings.payroll.calendarSalaryType).toLowerCase()} payday.`
  }

  if(calendarReminderStatus){
    const reminderDate = new Date(paydayDate)
    reminderDate.setDate(reminderDate.getDate() - 3)
    calendarReminderStatus.textContent = `Reminders go out on ${formatter.format(reminderDate)} so teams can clear approvals early.`
  }

  if(calendarCutoffStatus){
    const cutoffDate = new Date(paydayDate)
    cutoffDate.setDate(cutoffDate.getDate() - 2)
    calendarCutoffStatus.textContent = `Attendance and payroll edits close on ${formatter.format(cutoffDate)}.`
  }

  if(payrollCalendarDue){
    payrollCalendarDue.textContent = allApproved
      ? `${formatter.format(paydayDate)} is fully approved for release.`
      : isRejected
        ? `${formatter.format(paydayDate)} was rejected and needs changes before release.`
        : `${formatter.format(paydayDate)} is scheduled and waiting on final approvals.`
  }

  if(paydayCalendarGrid){
    paydayCalendarGrid.innerHTML = ""

    for(let month = 0; month < 12; month += 1){
      const currentDate = new Date(calendarYear, month, 1)
      const card = document.createElement("article")
      card.className = "payday-month-card"
      const monthName = currentDate.toLocaleDateString("en-KE", { month: "long" })
      const firstWeekday = currentDate.getDay()
      const daysInMonth = new Date(calendarYear, month + 1, 0).getDate()
      let dayMarkup = ""

      for(let spacer = 0; spacer < firstWeekday; spacer += 1){
        dayMarkup += `<span class="calendar-day muted"></span>`
      }

      for(let day = 1; day <= daysInMonth; day += 1){
        const isSelectedPayday = month === paydayDate.getMonth() && day === paydayDate.getDate()
        const isMonthlyPayday = monthlyPaydayDate && month === monthlyPaydayDate.getMonth() && day === monthlyPaydayDate.getDate()
        const isWeeklyPayday = weeklyPaydayDate && month === weeklyPaydayDate.getMonth() && day === weeklyPaydayDate.getDate()
        const classes = ["calendar-day"]
        if(isSelectedPayday){
          classes.push("payday")
        }
        if(isMonthlyPayday){
          classes.push("payday-monthly")
        }
        if(isWeeklyPayday){
          classes.push("payday-weekly")
        }
        if(isMonthlyPayday && isWeeklyPayday){
          classes.push("payday-both")
        }
        dayMarkup += `<span class="${classes.join(" ")}">${day}</span>`
      }

      card.innerHTML = `
        <h4>${monthName}</h4>
        <div class="calendar-weekdays">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>
        <div class="calendar-days">${dayMarkup}</div>
      `
      paydayCalendarGrid.appendChild(card)
    }
  }

  await renderCalendarApprovals(approvalState)
}

function getStructureMatchingEmployees(){
  const query = (appSettings.payroll.structureEmployeeSearch || "").trim().toLowerCase()
  const selectedDepartment = appSettings.payroll.structureDepartment || ""
  let employees = getEmployeeRecords().filter((employee) => employee.status === "ACTIVE")

  if(selectedDepartment){
    employees = employees.filter((employee) => (getDepartmentById(employee.departmentId)?.name || "") === selectedDepartment)
  }

  if(query){
    employees = employees.filter((employee) => String(employee.fullName || "").toLowerCase().includes(query))
  }

  return employees
  }

function getStructureTargetEmployee(){
  const matches = getStructureMatchingEmployees()

  const selectedEmployee = getSelectedEmployee()
  if(selectedEmployee){
    const selectedMatch = matches.find((employee) => employee.id === selectedEmployee.id)
    if(selectedMatch){
      return selectedMatch
    }
  }

  const loggedInName = (appSettings.profile.userName || "").trim().toLowerCase()
  if(loggedInName){
    const profileMatch = matches.find((employee) => employee.fullName.trim().toLowerCase() === loggedInName)
    if(profileMatch){
      return profileMatch
    }
  }

  return matches[0] || null
  }

function shouldShowStructureLoanFields(){
  const deductionType = String(structureDeductionType?.value || "").toLowerCase()
  return deductionType.includes("loan")
}

function toggleStructureLoanFields(){
  if(!structureLoanDetails) return
  structureLoanDetails.classList.toggle("is-hidden", !shouldShowStructureLoanFields())
}

function getStructureTargetDetails(){
  const targetEmployee = getStructureTargetEmployee()
  return {
    scope: "Individual",
    scopeLabel: "Individual",
    targetLabel: targetEmployee?.fullName || "Selected employee",
    targetEmployeeId: targetEmployee?.id || "",
    targetDepartmentId: targetEmployee?.departmentId || "",
    targetRoleTitle: ""
  }
}

function resetStructureLoanFields(){
  ;[
    structureLoanInstallment,
    structureLoanInstallments,
    structureLoanPaidInstallments,
    structureLoanNextDate
  ].forEach((field) => {
    if(field){
      field.value = ""
    }
  })
}

function collectStructureLoanDetails(){
  if(!shouldShowStructureLoanFields()){
    return null
  }

  return {
    enabled: true,
    installmentAmount: Number(structureLoanInstallment?.value || structureDeductionAmount?.value || 0),
    totalInstallments: Number(structureLoanInstallments?.value || 0),
    installmentsPaid: Number(structureLoanPaidInstallments?.value || 0),
    nextDeductionDate: structureLoanNextDate?.value || ""
  }
}

function getStructureChangeStatusText(change){
  const isLoanChange = String(change?.settlementMode || "").trim().toLowerCase() === "loan" || Boolean(change?.loanDetails)
  if(change?.settledAt){
    return isLoanChange
      ? "Loan settled"
      : "Settled after the next unpaid salary"
  }

  if(isLoanChange){
    const installmentsPaid = Number(change?.loanDetails?.installments_paid ?? change?.loanDetails?.installmentsPaid ?? 0)
    const totalInstallments = Number(change?.loanDetails?.total_installments ?? change?.loanDetails?.totalInstallments ?? 0)
    return totalInstallments > 0
      ? `${installmentsPaid}/${totalInstallments} installments paid`
      : "Loan installment tracking active"
  }

  return "Pending next unpaid salary"
}

async function renderStructureApprovals(approvalState = null){
  if(!structureApprovals) return

  let currentApprovalState = approvalState
  if(!currentApprovalState){
    try{
      currentApprovalState = await window.HexaPayApi.getPayrollStructureApprovalState()
    } catch (error){
      console.error("Failed to load payroll structure approvals", error)
    }
  }

  const currentUser = getCurrentAuthUserFromState(appState)
  structureApprovals.innerHTML = ""

  if(!currentApprovalState){
    structureApprovals.innerHTML = `<div class="structure-empty-state">Structure approvals are unavailable right now.</div>`
    if(printStructurePdfButton){
      printStructurePdfButton.disabled = true
    }
    return
  }

  if(Array.isArray(currentApprovalState.changes) && !currentApprovalState.changes.length){
    structureApprovals.innerHTML = `<div class="structure-empty-state">Add a payroll structure change to start the approval flow.</div>`
    if(printStructurePdfButton){
      printStructurePdfButton.disabled = true
    }
    return
  }

  currentApprovalState.approvals.forEach((approval, index) => {
    const canApprove = currentUser?.id === approval.approverId && approval.status === "pending"
    const buttonLabel = approval.status === "approved"
      ? "Approved"
      : approval.status === "rejected"
        ? "Rejected"
        : canApprove
          ? "Approve"
          : "Pending Approval"
    const card = document.createElement("div")
    card.className = "payroll-approval-card"
    card.innerHTML = `
      <strong>${approval.approverName}</strong>
      <span>${approval.role}${approval.rejectionReason ? ` • ${approval.rejectionReason}` : ""}</span>
      <div class="approve-actions">
        <button class="approve-button${approval.status === "approved" ? " approved" : ""}" data-structure-approval-index="${index}" data-structure-action="approve" ${canApprove ? "" : "disabled"}>
          ${buttonLabel}
        </button>
        <button class="approve-button reject-button${approval.status === "rejected" ? " rejected" : ""}" data-structure-approval-index="${index}" data-structure-action="reject" ${canApprove ? "" : "disabled"}>
          ${approval.status === "rejected" ? "Rejected" : "Reject"}
        </button>
      </div>
    `
    structureApprovals.appendChild(card)
  })

  if(printStructurePdfButton){
    printStructurePdfButton.disabled = currentApprovalState.status !== "approved"
  }
  }

async function renderPayrollStructure(){
  if(structureSalaryType){
    structureSalaryType.value = appSettings.payroll.structureSalaryType || "Monthly"
  }
  if(structureEmployeeSearch){
    structureEmployeeSearch.value = appSettings.payroll.structureEmployeeSearch || ""
    structureEmployeeSearch.placeholder = "Search employee name..."
  }

  renderPayrollStructureDepartmentOptions()
  structureAdvancePanel?.classList.remove("is-hidden")
  structureBonusPanel?.classList.remove("is-hidden")

  const targetEmployee = getStructureTargetEmployee()
  const targetDetails = getStructureTargetDetails()

  if(structureEmployeeName){
    structureEmployeeName.value = targetEmployee
      ? targetEmployee.fullName
      : "No employee selected"
  }
  if(structureEmployeeId){
    structureEmployeeId.value = targetEmployee?.identificationNumber || "No ID"
  }
  if(structureEmployeeRole){
    structureEmployeeRole.value = targetEmployee?.roleTitle || (appSettings.profile.userRole || "No role")
  }
  toggleStructureLoanFields()

  let structureState = latestPayrollStructureState
  try{
    structureState = await window.HexaPayApi.getPayrollStructureApprovalState()
    latestPayrollStructureState = structureState
  } catch (error){
    console.error("Failed to load payroll structure approval state", error)
    latestPayrollStructureState = null
  }

  if(structureChangesList){
    const formatter = getCurrencyFormatter()
    const changes = structureState?.changes || []
    if(!changes.length){
      structureChangesList.innerHTML = `<div class="structure-empty-state">No edits added yet. Add a payroll structure change to begin.</div>`
    } else {
      structureChangesList.innerHTML = changes.map((change) => `
        <div class="structure-change-item">
          <div>
            <strong>${change.type}</strong>
            <span>${change.scopeLabel} for ${change.targetLabel}</span>
            <div class="card-caption">${getStructureChangeStatusText(change)}</div>
          </div>
          <div class="structure-change-meta">
            <strong>${formatter.format(Number(change.amount || 0))}</strong>
            <button type="button" class="structure-remove-button" data-structure-change-id="${change.id}">Remove</button>
          </div>
        </div>
      `).join("")
    }
  }

  await renderStructureApprovals(structureState)
  }

async function addPayrollStructureChange(kind){
  const isDeduction = kind === "deduction"
  const typeField = isDeduction ? structureDeductionType : structureAllowanceType
  const amountField = isDeduction ? structureDeductionAmount : structureAllowanceAmount
  const rawAmount = Number(amountField?.value || 0)

  if(!typeField || !amountField || !rawAmount){
    return
  }

  const targetEmployee = getStructureTargetEmployee()
  const targetDetails = getStructureTargetDetails()

  if(!targetEmployee){
    window.alert("Select an employee before adding a payroll structure change.")
    return
  }
  const loanDetails = isDeduction ? collectStructureLoanDetails() : null

  try{
    const structureState = await window.HexaPayApi.createPayrollStructureChange({
      kind,
      type: typeField.value,
      amount: rawAmount,
      taxable: isDeduction ? false : Boolean(structureAllowanceTaxable?.checked),
      incomeCategory: isDeduction ? "deduction" : "allowance",
      salaryType: appSettings.payroll.structureSalaryType,
      scope: targetDetails.scope,
      scopeLabel: targetDetails.scopeLabel,
      targetLabel: targetDetails.targetLabel,
      targetEmployeeId: targetDetails.targetEmployeeId,
      targetDepartmentId: targetDetails.targetDepartmentId,
      targetRoleTitle: targetDetails.targetRoleTitle,
      loanDetails
    })
    latestPayrollStructureState = structureState
  } catch (error){
    console.error("Failed to create payroll structure change", error)
    window.alert(error.message || "Payroll structure change could not be saved right now.")
    return
  }

  markPayrollRunStale()
  amountField.value = ""
  if(isDeduction){
    resetStructureLoanFields()
  }
  persistSettings()
  await renderPayrollStructure()
  await renderPayrollSection()
  updateDashboardMetrics()
  addActivity("Payroll structure updated", `${typeField.value} of ${getCurrencyFormatter().format(rawAmount)} added for ${targetDetails.targetLabel}.`)
  }

function normalizePayrollDeductionToken(value){
  return String(value || "").trim().toLowerCase()
}

function getPayrollDeductionEntries(payrollItem){
  return Array.isArray(payrollItem?.deductionBreakdown)
    ? payrollItem.deductionBreakdown
    : []
}

function getPayrollItemPayeTaxableBase(payrollItem){
  const fallbackTaxablePay = Number(payrollItem?.taxablePay ?? payrollItem?.baseSalary ?? 0)
  const resolvedBase = Number(payrollItem?.payeTaxableBase ?? payrollItem?.breakdown?.paye_taxable_base ?? payrollItem?.breakdown?.payeTaxableBase ?? fallbackTaxablePay)
  return Number.isFinite(resolvedBase) ? resolvedBase : fallbackTaxablePay
}

function isPayrollItemUsingDisplayedStalePayeStructure(payrollItem, summary){
  const taxablePay = Number(payrollItem?.taxablePay ?? payrollItem?.baseSalary ?? 0)
  const payeTaxableBase = getPayrollItemPayeTaxableBase(payrollItem)
  const hasPrePayeStatutoryDeductions = summary.shif > 0 || summary.nssf > 0 || summary.housingLevy > 0

  if(!hasPrePayeStatutoryDeductions){
    return false
  }

  return !Number.isFinite(payeTaxableBase) || payeTaxableBase >= taxablePay
}

function getPayrollItemStatutoryEnabled(payrollItem, employee, summary){
  const financialProfile = normalizeEmployeeFinancialProfile(employee?.financialProfile)
  const applyTaxFinancials = Boolean(financialProfile.applyTaxFinancials)

  if(applyTaxFinancials){
    return {
      paye: financialProfile.statutory.paye !== false,
      shif: financialProfile.statutory.shif !== false,
      nssf: financialProfile.statutory.nssf !== false,
      housingLevy: financialProfile.statutory.housingLevy !== false
    }
  }

  return {
    paye: summary.paye > 0,
    shif: summary.shif > 0,
    nssf: summary.nssf > 0,
    housingLevy: summary.housingLevy > 0
  }
}

function getPayrollDeductionSummary(payrollItem, employee = null){
  const summary = {
    paye: 0,
    nssf: 0,
    shif: 0,
    housingLevy: 0,
    advance: 0,
    other: 0,
    payeTaxableBase: getPayrollItemPayeTaxableBase(payrollItem)
  }

  getPayrollDeductionEntries(payrollItem).forEach((entry) => {
    const amount = Number(entry?.amount || 0)
    if(amount <= 0){
      return
    }

    const sourceType = normalizePayrollDeductionToken(entry?.sourceType)
    const label = normalizePayrollDeductionToken(entry?.label)

    if(sourceType === "statutory_paye" || label === "paye"){
      summary.paye += amount
      return
    }

    if(sourceType === "statutory_nssf" || label === "nssf"){
      summary.nssf += amount
      return
    }

    if(sourceType === "statutory_shif" || label === "shif"){
      summary.shif += amount
      return
    }

    if(sourceType === "statutory_housing_levy" || label === "housing levy" || label === "housing"){
      summary.housingLevy += amount
      return
    }

    if(sourceType === "employee_loan" || sourceType === "loan" || label.includes("advance") || label.includes("loan")){
      summary.advance += amount
      return
    }

    summary.other += amount
  })

  if(summary.advance <= 0 && Number(payrollItem?.loanDeductionsTotal || 0) > 0){
    summary.advance = Number(payrollItem.loanDeductionsTotal || 0)
  }

  if(statutoryHelpers?.calculateStatutoryDeductions && isPayrollItemUsingDisplayedStalePayeStructure(payrollItem, summary)){
    const recalculatedStatutory = statutoryHelpers.calculateStatutoryDeductions({
      grossSalary: Number(payrollItem?.grossPay ?? payrollItem?.baseSalary ?? 0),
      taxablePay: Number(payrollItem?.taxablePay ?? payrollItem?.baseSalary ?? 0),
      customDeductions: 0,
      config: getEffectiveStatutoryConfiguration(),
      enabled: getPayrollItemStatutoryEnabled(payrollItem, employee, summary)
    })

    summary.paye = Number(recalculatedStatutory.paye || 0)
    summary.shif = Number(recalculatedStatutory.shif || 0)
    summary.nssf = Number(recalculatedStatutory.nssf || 0)
    summary.housingLevy = Number(recalculatedStatutory.housingLevy || 0)
    summary.payeTaxableBase = Number(recalculatedStatutory.payeTaxableBase || 0)
  }

  return {
    ...summary,
    deductiblesTotal: summary.nssf + summary.shif + summary.housingLevy + summary.advance + summary.other
  }
}

async function renderPayrollHistory(){
  if(!payrollHistoryArea){
    return
  }

  let payrollRuns = getPayrollRuns()
  try{
    payrollRuns = await window.HexaPayApi.getPayrollRuns()
  } catch (error){
    console.error("Failed to load payroll history", error)
  }

  const sortedRuns = payrollRuns
    .slice()
    .sort((runA, runB) => new Date(runB.generatedAt || 0).getTime() - new Date(runA.generatedAt || 0).getTime())

  syncPayrollHistoryControls(sortedRuns)

  const filteredRuns = sortedRuns
    .filter((run) => doesPayrollRunMatchHistoryView(run, appSettings.payroll.historyView))
    .filter((run) => !appSettings.payroll.historyRunId || run.id === appSettings.payroll.historyRunId)

  if(!filteredRuns.length){
    payrollHistoryArea.innerHTML = `<div class="structure-empty-state">No payroll runs match the selected payroll history view.</div>`
    return
  }

  const formatter = getCurrencyFormatter()
  payrollHistoryArea.innerHTML = filteredRuns.map((run) => {
    const itemCount = Number(run.itemCount || run.itemIds?.length || 0)
    const paidItemCount = Number(run.paidItemCount || 0)
    const unpaidItemCount = Number(run.unpaidItemCount ?? Math.max(0, itemCount - paidItemCount))
    const historyViewLabel = getPayrollHistoryViewForRun(run)
    return `
      <article class="payroll-history-card">
        <div>
          <h4>${formatPayrollPeriodLabel(run.period, run.salaryType)}${run.departmentScope ? ` • ${run.departmentScope}` : ""}</h4>
          <p>${historyViewLabel.charAt(0).toUpperCase() + historyViewLabel.slice(1)} payroll • ${getPayrollRunStatusLabel(run.status)} • Generated ${formatUiDate(run.generatedAt)}</p>
          <p>${formatter.format(Number(run.totals?.netPay || 0))} net pay in this run.</p>
        </div>
        <div class="payroll-history-metrics">
          <div class="payroll-history-metric">
            <strong>${itemCount}</strong>
            <span>Employees in run</span>
          </div>
          <div class="payroll-history-metric">
            <strong>${paidItemCount}</strong>
            <span>Confirmed paid</span>
          </div>
          <div class="payroll-history-metric">
            <strong>${unpaidItemCount}</strong>
            <span>Still unpaid</span>
          </div>
          <div class="payroll-history-metric">
            <strong>${run.lastPaidAt ? formatUiDate(run.lastPaidAt) : "Not yet"}</strong>
            <span>Last paid update</span>
          </div>
        </div>
        <div class="payroll-history-actions">
          <button type="button" class="approve-button" data-payroll-history-run-id="${run.id}">Open Run</button>
        </div>
      </article>
    `
  }).join("")
}

async function renderPayrollRun(payrollPayloadOverride = null){
if(!payrollTablesArea) return

const formatter = getCurrencyFormatter()
const salaryType = appSettings.payroll.salaryType
let payrollPayload = payrollPayloadOverride

if(!payrollPayload){
  try{
    payrollPayload = await window.HexaPayApi.generatePayrollRun({
      period: appSettings.payroll.due,
      salaryType: appSettings.payroll.salaryType,
      departmentScope: appSettings.payroll.department || "",
      forceRegenerate: Boolean(appSettings.payroll.forceRegenerate)
    })
  } catch (error){
    console.error("Failed to load payroll run", error)
    payrollTablesArea.innerHTML = `<div class="settings-card"><p>Payroll run could not be generated right now.</p></div>`
    return
  }
}

const { run, items } = payrollPayload
appSettings.payroll.currentRunId = run.id
appSettings.payroll.forceRegenerate = false
const grouped = {}

items.forEach((payrollItem) => {
  const employee = getEmployeeById(payrollItem.employeeId)
  if(!employee){
    return
  }

  const department = getDepartmentById(payrollItem.departmentId)?.name || "Unassigned"
  if(!grouped[department]){
    grouped[department] = []
  }
  grouped[department].push({
    employee,
    payrollItem
  })
})

payrollTablesArea.innerHTML = ""

Object.entries(grouped).forEach(([department, rows]) => {
  const block = document.createElement("section")
  block.className = "payroll-department-block"
  let rowsMarkup = ""

  rows.forEach(({ employee, payrollItem }, index) => {
    const deductionSummary = getPayrollDeductionSummary(payrollItem, employee)
    const isPaid = Boolean(payrollItem.paid || payrollItem.signed)
    const paidMeta = isPaid
      ? `<div class="payroll-paid-meta">Paid ${formatUiDate(payrollItem.paidAt || new Date().toISOString())}</div>`
      : `<div class="payroll-paid-meta">Awaiting payment confirmation</div>`
    rowsMarkup += `
      <tr>
        <td>${index + 1}</td>
        <td>${employee.fullName}</td>
        <td>${employee.roleTitle}</td>
        <td>
          <strong>${formatter.format(payrollItem.grossPay || payrollItem.baseSalary || 0)}</strong>
          <div class="card-caption">Taxable: ${formatter.format(payrollItem.taxablePay || payrollItem.baseSalary || 0)}</div>
          <div class="card-caption">PAYE Base: ${formatter.format(deductionSummary.payeTaxableBase ?? payrollItem.payeTaxableBase ?? payrollItem.taxablePay ?? payrollItem.baseSalary ?? 0)}</div>
        </td>
        <td>
          <strong>${formatter.format(deductionSummary.paye)}</strong>
        </td>
        <td>
          <strong>${formatter.format(deductionSummary.deductiblesTotal)}</strong>
          <div class="card-caption">SHIF: ${formatter.format(deductionSummary.shif)}</div>
          <div class="card-caption">NSSF: ${formatter.format(deductionSummary.nssf)}</div>
          <div class="card-caption">Housing: ${formatter.format(deductionSummary.housingLevy)}</div>
          <div class="card-caption">Advance: ${formatter.format(deductionSummary.advance)}</div>
          ${deductionSummary.other > 0 ? `<div class="card-caption">Other: ${formatter.format(deductionSummary.other)}</div>` : ""}
        </td>
        <td>${formatter.format(payrollItem.allowances || 0)}</td>
        <td>${formatter.format(payrollItem.netPay || 0)}</td>
        <td>${getPayrollAttendanceStatusLabel(payrollItem, employee)}</td>
        <td>
          <div class="payroll-payment-cell">
            <button
              type="button"
              class="approve-button payroll-paid-button${isPaid ? " approved" : ""}"
              data-payroll-pay-action="confirm"
              data-payroll-item-id="${payrollItem.id}"
              ${isPaid ? "disabled" : ""}
            >
              ${isPaid ? "Paid" : "Confirm Paid"}
            </button>
            ${paidMeta}
          </div>
        </td>
      </tr>
    `
  })

  block.innerHTML = `
    <h3 class="payroll-department-title">${department}</h3>
    <table class="payroll-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Employee Name</th>
          <th>Role</th>
          <th>Gross</th>
          <th>PAYE</th>
          <th>Deductibles</th>
          <th>Allowa..</th>
          <th>Net</th>
          <th>Attendance / Status</th>
          <th>Payment</th>
        </tr>
      </thead>
      <tbody>${rowsMarkup}</tbody>
    </table>
  `
  payrollTablesArea.appendChild(block)
})

if(!Object.keys(grouped).length){
  payrollTablesArea.innerHTML = `<div class="settings-card"><p>No payroll entries match the selected department.</p></div>`
}

if(payrollCalendarDue){
  const statusLabel = run.status === "approved"
    ? "fully approved"
    : run.status === "posted"
      ? "paid and posted"
    : run.status === "rejected"
      ? "rejected"
      : "pending approvals"
  payrollCalendarDue.textContent = `${run.period} payroll run is currently ${statusLabel}.`
}

await renderPayrollApprovals(run)
updateDashboardMetrics()
}

async function renderPayrollSection(){
  syncApprovalTemplatesForState(appState)
  if(payrollSalaryType){
    payrollSalaryType.value = appSettings.payroll.salaryType
  }
  renderPayrollDueOptions()
document.querySelectorAll(".payroll-tab").forEach((tab) => tab.classList.remove("active"))
document.querySelectorAll(".payroll-tab-content").forEach((content) => content.classList.remove("active-payroll-tab"))
document.getElementById(appSettings.payroll.activeTab || "payrollRun")?.classList.add("active-payroll-tab")
findTargetedTrigger("[data-payroll-tab-target]", "data-payroll-tab-target", appSettings.payroll.activeTab || "payrollRun")?.classList.add("active")
  renderPayrollDepartmentOptions()
  await renderPayrollRun()
  await renderPayrollHistory()
  await renderPayrollStructure()
  await renderPayCalendar()
  }

function openWorktrackTab(tabId){
  syncTargetedNavigation({
    triggerSelector: "[data-worktrack-tab-target]",
    triggerAttribute: "data-worktrack-tab-target",
    panelSelector: ".worktrack-tab-content",
    panelActiveClass: "active-worktrack-tab",
    activePanelId: tabId
  })
  appSettings.worktrack.activeTab = tabId
  persistSettings()
  renderWorktrackSection()
  scrollContentToTop(tabId)
  }

function getAttendanceWorktrackRows(){
  const activeCompanyId = String(getActiveCompany()?.id || "").trim()
  const departmentId = String(appSettings.worktrack.attendanceDepartmentId || "").trim()
  return getEmployeesByStatuses(["ACTIVE", "LEAVE"]).filter((employee) => {
    if(activeCompanyId && String(employee.companyId || "") !== activeCompanyId){
      return false
    }

    if(hasLiveBackendSession() && !/^[a-f\d]{24}$/i.test(String(employee.id || "").trim())){
      return false
    }

    return !departmentId || String(employee.departmentId || "") === departmentId
  })
  }

function getDefaultAttendanceApprovals(){
  syncApprovalTemplatesForState(appState)
  return mergeApprovalTemplates([], buildWorkflowApprovalTemplates(appState, "attendance"))
  }

function getApprovalStatus(approval){
  if(!approval){
    return "pending"
  }

  return approval.status || (approval.approved ? "approved" : "pending")
  }

function getApprovalDisplayName(approval){
  return approval?.approverName || approval?.approver || "Unassigned"
  }

function getApprovalActorId(approval){
  if(approval?.approverId){
    return approval.approverId
  }

  const approverName = String(getApprovalDisplayName(approval)).trim().toLowerCase()
  return appState.auth.users.find((user) =>
    String(user.displayName || "").trim().toLowerCase() === approverName
  )?.id || ""
  }

function isAttendanceLogApproved(log){
  return Array.isArray(log.approvals) && log.approvals.every((approval) => getApprovalStatus(approval) === "approved")
  }

function getFilteredAttendanceLogs(){
  const view = appSettings.worktrack.attendanceView || "daily"
  const filterMode = appSettings.worktrack.attendanceDateFilterMode || "current_period"
  const departmentId = String(appSettings.worktrack.attendanceDepartmentId || "").trim()
  const logs = getVisibleAttendanceLogRecords()
    .filter((log) => !departmentId || String(log.departmentId || "") === departmentId)

  if(filterMode === "specific_date"){
    return logs.filter((log) => log.date === appSettings.worktrack.attendanceDate)
  }

  if(filterMode === "custom_range"){
    const from = appSettings.worktrack.attendanceFrom
    const to = appSettings.worktrack.attendanceTo
    return logs.filter((log) => (!from || log.date >= from) && (!to || log.date <= to))
  }

  if(view === "daily"){
    return logs.filter((log) => log.date === appSettings.worktrack.attendanceDate)
  }

  if(view === "weekly"){
    const from = appSettings.worktrack.attendanceFrom
    const to = appSettings.worktrack.attendanceTo
    return logs.filter((log) => (!from || log.date >= from) && (!to || log.date <= to))
  }

  return logs.filter((log) => log.date.startsWith(appSettings.worktrack.attendanceMonth || ""))
  }

function syncAttendanceCurrentPeriodValues(){
  const view = appSettings.worktrack.attendanceView || "daily"
  const filterMode = appSettings.worktrack.attendanceDateFilterMode || "current_period"

  if(filterMode !== "current_period"){
    return
  }

  if(view === "daily"){
    appSettings.worktrack.attendanceDate = appSettings.worktrack.attendanceDate || getTodayDateKey()
    return
  }

  if(view === "weekly"){
    const referenceDate = parseLocalDateKey(appSettings.worktrack.attendanceDate)
      || parseLocalDateKey(appSettings.worktrack.attendanceFrom)
      || parseLocalDateKey(appSettings.worktrack.attendanceTo)
      || new Date()
    const weekStart = getStartOfIsoWeek(referenceDate)
    const weekEnd = getEndOfIsoWeek(referenceDate)
    appSettings.worktrack.attendanceFrom = formatDateKey(weekStart)
    appSettings.worktrack.attendanceTo = formatDateKey(weekEnd)
    return
  }

  appSettings.worktrack.attendanceMonth = appSettings.worktrack.attendanceMonth || getCurrentPayrollMonthKey()
}

function getAttendanceEntriesForCurrentFilters(){
  return [...getFilteredAttendanceLogs()].sort((left, right) => {
    const leftDate = `${left.date || ""} ${left.checkIn || ""}`
    const rightDate = `${right.date || ""} ${right.checkIn || ""}`
    return leftDate < rightDate ? 1 : leftDate > rightDate ? -1 : 0
  })
}

function renderAttendanceFilterControls(){
  const filterMode = appSettings.worktrack.attendanceDateFilterMode || "current_period"
  const view = appSettings.worktrack.attendanceView || "daily"

  if(attendanceDateFilterMode){
    attendanceDateFilterMode.value = filterMode
  }

  if(attendanceDateFieldLabel){
    const showDateField = filterMode === "specific_date" || (filterMode === "current_period" && view === "daily")
    attendanceDateFieldLabel.classList.toggle("is-hidden", !showDateField)
  }

  if(attendanceFromFieldLabel){
    const showFromField = filterMode === "custom_range" || (filterMode === "current_period" && view === "weekly")
    attendanceFromFieldLabel.classList.toggle("is-hidden", !showFromField)
  }

  if(attendanceToFieldLabel){
    const showToField = filterMode === "custom_range" || (filterMode === "current_period" && view === "weekly")
    attendanceToFieldLabel.classList.toggle("is-hidden", !showToField)
  }

  if(attendanceMonthFieldLabel){
    const showMonthField = filterMode === "current_period" && view === "monthly"
    attendanceMonthFieldLabel.classList.toggle("is-hidden", !showMonthField)
  }
}

function renderAttendanceDepartmentFilter(){
  if(!attendanceDepartmentFilter){
    return
  }

  const currentValue = String(appSettings.worktrack.attendanceDepartmentId || "")
  attendanceDepartmentFilter.innerHTML = `<option value="">All Departments</option>`
  getAvailableDepartments().forEach((department) => {
    const option = document.createElement("option")
    option.value = department.id
    option.textContent = department.name
    attendanceDepartmentFilter.appendChild(option)
  })
  attendanceDepartmentFilter.value = Array.from(attendanceDepartmentFilter.options).some((option) => option.value === currentValue)
    ? currentValue
    : ""
}

function getAttendanceTrackedPeriodLabel(){
  const filterMode = appSettings.worktrack.attendanceDateFilterMode || "current_period"
  const view = appSettings.worktrack.attendanceView || "daily"

  if(filterMode === "specific_date"){
    return `Viewing attendance for ${appSettings.worktrack.attendanceDate}.`
  }

  if(filterMode === "custom_range"){
    return `Viewing attendance from ${appSettings.worktrack.attendanceFrom} to ${appSettings.worktrack.attendanceTo}.`
  }

  if(view === "daily"){
    return `Viewing attendance for ${appSettings.worktrack.attendanceDate}.`
  }

  if(view === "weekly"){
    return `Viewing attendance from ${appSettings.worktrack.attendanceFrom} to ${appSettings.worktrack.attendanceTo}.`
  }

  return `Viewing attendance for ${appSettings.worktrack.attendanceMonth}.`
}

function getAttendanceExportFilters(){
  const filterMode = appSettings.worktrack.attendanceDateFilterMode || "current_period"
  const view = appSettings.worktrack.attendanceView || "daily"
  const departmentId = String(appSettings.worktrack.attendanceDepartmentId || "").trim()
  const filters = {}

  if(departmentId){
    filters.department_id = departmentId
  }

  if(filterMode === "specific_date"){
    filters.specific_date = appSettings.worktrack.attendanceDate
    return filters
  }

  if(filterMode === "custom_range"){
    if(appSettings.worktrack.attendanceFrom){
      filters.from_date = appSettings.worktrack.attendanceFrom
    }
    if(appSettings.worktrack.attendanceTo){
      filters.to_date = appSettings.worktrack.attendanceTo
    }
    return filters
  }

  if(view === "daily"){
    filters.specific_date = appSettings.worktrack.attendanceDate
  } else if(view === "weekly"){
    if(appSettings.worktrack.attendanceFrom){
      filters.from_date = appSettings.worktrack.attendanceFrom
    }
    if(appSettings.worktrack.attendanceTo){
      filters.to_date = appSettings.worktrack.attendanceTo
    }
  } else if(appSettings.worktrack.attendanceMonth){
    filters.month = appSettings.worktrack.attendanceMonth
  }

  return filters
}

function getAttendanceLogSummary(){
  const employees = getAttendanceWorktrackRows()
  const filteredLogs = getFilteredAttendanceLogs()
  const approvedEntries = filteredLogs.filter((log) => isAttendanceLogApproved(log)).length

  return employees.reduce((summary, employee) => {
    const daysAttended = getAttendanceDays(employee)
    const dailyRate = getPayrollDailyRate(employee, buildEmployeeMeta(employee))
    summary.totalDays += daysAttended
    summary.totalSalary += daysAttended * dailyRate
    return summary
  }, {
    employeeCount: employees.length,
    totalEntries: filteredLogs.length,
    approvedEntries,
    totalDays: 0,
    totalSalary: 0
  })
}

function getAttendanceDays(employee){
  const filteredLogs = getFilteredAttendanceLogs()
  return filteredLogs.filter((log) => String(log.employeeId) === String(employee.id)).length
  }

function getHoursWorked(checkIn, checkOut){
  if(!checkIn || !checkOut){
    return 0
  }

  const [inHours, inMinutes] = checkIn.split(":").map(Number)
  const [outHours, outMinutes] = checkOut.split(":").map(Number)
  const startMinutes = inHours * 60 + inMinutes
  const endMinutes = outHours * 60 + outMinutes
  return Math.max(0, (endMinutes - startMinutes) / 60)
  }

function populateWorktrackEmployeeSelects(searchText = ""){
  const query = searchText.trim().toLowerCase()
  const employees = getEmployeeRecords()
    .filter((employee) => !query || employee.fullName.toLowerCase().includes(query))
    .map((employee) => ({
      id: employee.id,
      name: employee.fullName,
      department: getDepartmentById(employee.departmentId)?.name || "Unassigned"
    }))

  if(attendanceEmployeeSelect){
    const currentAttendanceValue = attendanceEmployeeSelect.value
    attendanceEmployeeSelect.innerHTML = ""
    employees.forEach((employee) => {
      const option = document.createElement("option")
      option.value = employee.id
      option.textContent = `${employee.name} • ${employee.department}`
      attendanceEmployeeSelect.appendChild(option)
    })
    if(currentAttendanceValue && Array.from(attendanceEmployeeSelect.options).some((option) => option.value === currentAttendanceValue)){
      attendanceEmployeeSelect.value = currentAttendanceValue
    }
  }

  if(leaveEmployeeSelect){
    const currentLeaveValue = leaveEmployeeSelect.value
    leaveEmployeeSelect.innerHTML = ""
    employees.forEach((employee) => {
      const option = document.createElement("option")
      option.value = employee.id
      option.textContent = `${employee.name} • ${employee.department}`
      leaveEmployeeSelect.appendChild(option)
    })
    if(currentLeaveValue && Array.from(leaveEmployeeSelect.options).some((option) => option.value === currentLeaveValue)){
      leaveEmployeeSelect.value = currentLeaveValue
    }
  }
  }

function renderAttendanceApprovals(){
  if(!attendanceApprovalList || !attendanceEntrySummary) return

  const entry = getAttendanceLogById(selectedAttendanceEntryId)
  const currentUser = getCurrentAuthUserFromState(appState)
  attendanceApprovalList.innerHTML = ""

  if(!entry){
    attendanceEntrySummary.textContent = "Choose or create a daily check-in to review approvals."
    return
  }

  const hoursWorked = getHoursWorked(entry.checkIn, entry.checkOut).toFixed(1)
  attendanceEntrySummary.textContent = `${entry.employeeName} checked in at ${entry.checkIn} and out at ${entry.checkOut} on ${entry.date} for ${hoursWorked} hours.`

  entry.approvals.forEach((approval, index) => {
    const approvalStatus = getApprovalStatus(approval)
    const canApprove = currentUser?.id === getApprovalActorId(approval) && approvalStatus === "pending"
    const buttonLabel = approvalStatus === "approved"
      ? "Approved"
      : approvalStatus === "rejected"
        ? "Rejected"
        : canApprove
          ? "Approve"
          : "Pending Approval"
    const card = document.createElement("div")
    card.className = "payroll-approval-card"
    card.innerHTML = `
      <strong>${approval.role}</strong>
      <span>${getApprovalDisplayName(approval)}${approval.rejectionReason ? ` • ${approval.rejectionReason}` : ""}</span>
      <button class="approve-button${approvalStatus === "approved" ? " approved" : ""}" data-attendance-approval-index="${index}" ${canApprove ? "" : "disabled"}>
        ${buttonLabel}
      </button>
    `
    attendanceApprovalList.appendChild(card)
  })
  }

function renderAttendanceTab(){
  syncApprovalTemplatesForState(appState)
  if(!attendanceTableBody) return

  syncAttendanceCurrentPeriodValues()
  const formatter = getCurrencyFormatter()
  const rows = getAttendanceWorktrackRows()
  const filteredLogs = getFilteredAttendanceLogs()
  const attendanceSummary = getAttendanceLogSummary()

  if(!selectedAttendanceEntryId && filteredLogs.length){
    selectedAttendanceEntryId = filteredLogs[0].id
    appState.attendance.selectedLogId = selectedAttendanceEntryId
  }
  if(selectedAttendanceEntryId && !getVisibleAttendanceLogRecords().some((log) => log.id === selectedAttendanceEntryId)){
    selectedAttendanceEntryId = filteredLogs[0]?.id || null
    appState.attendance.selectedLogId = selectedAttendanceEntryId
  }

  populateWorktrackEmployeeSelects(attendanceEmployeeSearch?.value || "")
  renderAttendanceDepartmentFilter()
  renderAttendanceFilterControls()

  if(attendanceViewMode){
    attendanceViewMode.value = appSettings.worktrack.attendanceView || "daily"
  }
  if(attendanceDateFilterMode){
    attendanceDateFilterMode.value = appSettings.worktrack.attendanceDateFilterMode || "current_period"
  }
  if(attendanceDateInput){
    attendanceDateInput.value = appSettings.worktrack.attendanceDate || ""
  }
  if(attendanceFromInput){
    attendanceFromInput.value = appSettings.worktrack.attendanceFrom || ""
  }
  if(attendanceToInput){
    attendanceToInput.value = appSettings.worktrack.attendanceTo || ""
  }
  if(attendanceMonthInput){
    attendanceMonthInput.value = appSettings.worktrack.attendanceMonth || ""
  }
  if(attendanceEntryDate){
    attendanceEntryDate.value = appSettings.worktrack.attendanceDate || ""
  }

  attendanceTableBody.innerHTML = rows.map((employee, index) => {
    const meta = buildEmployeeMeta(employee)
    const daysAttended = getAttendanceDays(employee)
    const dailyRate = getPayrollDailyRate(employee, meta)
    const calculatedSalary = daysAttended * dailyRate
    const matchingLog = filteredLogs.find((log) => log.employeeId === employee.id)

    return `
      <tr data-attendance-log-id="${matchingLog?.id || ""}">
        <td>${index + 1}</td>
        <td>${getEmployeeDisplayName(employee)}</td>
        <td>${getEmployeeDepartmentName(employee)}</td>
        <td>${meta.role}</td>
        <td>${daysAttended}</td>
        <td>${formatter.format(dailyRate)}</td>
        <td>${formatter.format(calculatedSalary)}</td>
      </tr>
    `
  }).join("")

  if(attendanceEntriesTableBody){
    const filteredEntries = getAttendanceEntriesForCurrentFilters()
    attendanceEntriesTableBody.innerHTML = filteredEntries.length
      ? filteredEntries.map((log, index) => `
        <tr data-attendance-log-id="${log.id}">
          <td>${index + 1}</td>
          <td>${log.employeeName || log.employee || ""}</td>
          <td>${log.departmentName || log.department || "Unassigned"}</td>
          <td>${log.date || ""}</td>
          <td>${log.checkIn || ""}</td>
          <td>${log.checkOut || ""}</td>
          <td>${Number(getHoursWorked(log.checkIn, log.checkOut)).toFixed(1)}</td>
          <td>${Array.isArray(log.approvals) && log.approvals.some((approval) => getApprovalStatus(approval) === "rejected") ? "Rejected" : isAttendanceLogApproved(log) ? "Approved" : "Pending"}</td>
        </tr>
      `).join("")
      : `<tr><td colspan="8">No attendance entries match the current filters.</td></tr>`
  }

  if(attendanceSummaryText){
    attendanceSummaryText.textContent = `${attendanceSummary.employeeCount} team members recorded ${attendanceSummary.totalDays} check-ins across ${attendanceSummary.totalEntries} entries in the selected period. ${attendanceSummary.approvedEntries} entries are approved for an estimated ${formatter.format(attendanceSummary.totalSalary)} payout.`
  }

  if(attendanceTrackedPeriod){
    attendanceTrackedPeriod.textContent = getAttendanceTrackedPeriodLabel()
  }

  renderAttendanceApprovals()
  }

function getLeaveRequestsByStatus(status){
  return getVisibleLeaveRequestRecords().filter((request) => request.status === status)
  }

function getStatusDrivenActiveLeaves(){
  const activeLeaveEmployeeIds = new Set(
    getLeaveRequestsByStatus("Active").map((request) => String(request.employeeId))
  )

  return getEmployeeRecords()
    .filter((employee) => employee.status === "LEAVE" && !activeLeaveEmployeeIds.has(String(employee.id)))
    .map((employee) => ({
      id: `status-leave-${employee.id}`,
      companyId: employee.companyId,
      employeeId: employee.id,
      employeeName: employee.fullName,
      leaveType: "Status Leave",
      departmentId: employee.departmentId,
      departmentName: getEmployeeDepartmentName(employee),
      fromDate: getTodayDateKey(),
      toDate: getTodayDateKey(),
      requestedDate: getTodayDateKey(),
      status: "Active",
      approvals: []
    }))
}

function getLeaveSummary(){
  const activeLeaves = getLeaveRequestsByStatus("Active").concat(getStatusDrivenActiveLeaves())
  const pendingLeaves = getLeaveRequestsByStatus("Pending")
  const nextReturn = [...activeLeaves].sort((a, b) => new Date(a.toDate) - new Date(b.toDate))[0]
  return { activeLeaves, pendingLeaves, nextReturn }
}

function renderLeaveApprovals(){
  if(!leaveApprovalList || !selectedLeaveSummary || !rejectLeaveButton) return

  const pendingRequest = getLeaveRequestById(selectedPendingLeaveId)
  const currentUser = getCurrentAuthUserFromState(appState)
  leaveApprovalList.innerHTML = ""

  if(!pendingRequest || pendingRequest.status !== "Pending"){
    selectedLeaveSummary.textContent = "Pick a pending leave request to review approvals."
    rejectLeaveButton.disabled = true
    return
  }

  selectedLeaveSummary.textContent = `${pendingRequest.employeeName} requested ${pendingRequest.leaveType} from ${pendingRequest.fromDate} to ${pendingRequest.toDate}.`
  rejectLeaveButton.disabled = !pendingRequest.approvals.some((approval) =>
    currentUser?.id === getApprovalActorId(approval) && getApprovalStatus(approval) === "pending"
  )

  pendingRequest.approvals.forEach((approval, index) => {
    const approvalStatus = getApprovalStatus(approval)
    const canApprove = currentUser?.id === getApprovalActorId(approval) && approvalStatus === "pending"
    const buttonLabel = approvalStatus === "approved"
      ? "Approved"
      : approvalStatus === "rejected"
        ? "Rejected"
        : canApprove
          ? "Approve"
          : "Pending Approval"
    const card = document.createElement("div")
    card.className = "payroll-approval-card"
    card.innerHTML = `
      <strong>${approval.role}</strong>
      <span>${getApprovalDisplayName(approval)}${approval.rejectionReason ? ` • ${approval.rejectionReason}` : ""}</span>
      <button class="approve-button${approvalStatus === "approved" ? " approved" : ""}" data-leave-approval-index="${index}" ${canApprove ? "" : "disabled"}>
        ${buttonLabel}
      </button>
    `
    leaveApprovalList.appendChild(card)
  })
  }

function renderLeaveManagementTab(){
  syncApprovalTemplatesForState(appState)
  const { activeLeaves, pendingLeaves, nextReturn } = getLeaveSummary()

  if(!selectedPendingLeaveId && pendingLeaves.length){
    selectedPendingLeaveId = pendingLeaves[0].id
    appState.leave.selectedRequestId = selectedPendingLeaveId
  }
  if(selectedPendingLeaveId && !pendingLeaves.some((request) => request.id === selectedPendingLeaveId)){
    selectedPendingLeaveId = pendingLeaves[0]?.id || null
    appState.leave.selectedRequestId = selectedPendingLeaveId
  }

  if(activeLeaveTableBody){
    activeLeaveTableBody.innerHTML = activeLeaves.map((request) => `
        <tr>
          <td>${request.employeeName}</td>
          <td>${request.leaveType}</td>
          <td>${request.departmentName}</td>
          <td>${request.fromDate}</td>
          <td>${request.toDate}</td>
          <td><button type="button" class="department-action-button" data-return-leave-id="${request.id}" data-return-employee-id="${request.employeeId}">Returned From Leave</button></td>
        </tr>
      `).join("") || `<tr><td colspan="6">No active leave requests right now.</td></tr>`
  }

  if(pendingLeaveTableBody){
    pendingLeaveTableBody.innerHTML = pendingLeaves.map((request) => `
      <tr class="${request.id === selectedPendingLeaveId ? "selected" : ""}" data-pending-leave-id="${request.id}">
        <td>${request.employeeName}</td>
        <td>${request.leaveType}</td>
        <td>${request.departmentName}</td>
        <td>${request.requestedDate}</td>
        <td>${request.status}</td>
      </tr>
    `).join("") || `<tr><td colspan="5">No pending leave approvals right now.</td></tr>`
  }

  if(activeLeaveCount){
    activeLeaveCount.textContent = `${activeLeaves.length} employees currently have approved leave.`
  }

  if(pendingLeaveCount){
    pendingLeaveCount.textContent = `${pendingLeaves.length} leave requests are waiting for action.`
  }

  if(leaveReturnDue){
    leaveReturnDue.textContent = nextReturn
      ? `${nextReturn.employeeName} is due back on ${nextReturn.toDate}.`
      : "No one is due back soon."
  }

  renderLeaveApprovals()
  }

function resetOvertimeRateEditor(){
  selectedOvertimeRateId = null
  if(overtimeDepartmentInput && !overtimeDepartmentInput.value && overtimeDepartmentInput.options.length){
    overtimeDepartmentInput.value = overtimeDepartmentInput.options[0].value
  }
  renderOvertimeRoleOptions()
  if(overtimeRoleInput){
    overtimeRoleInput.value = ""
  }
  if(overtimeRateInput){
    overtimeRateInput.value = ""
  }
  if(saveOvertimeRateButton){
    saveOvertimeRateButton.textContent = "Save Rate"
  }
  if(deleteOvertimeRateButton){
    deleteOvertimeRateButton.disabled = true
    deleteOvertimeRateButton.classList.add("btn-disabled")
  }
}

function getHolidayByScopeAndId(scope, holidayId){
  const records = scope === "national" ? getVisibleNationalHolidayRecords() : getVisibleCompanyHolidayRecords()
  return records.find((holiday) => String(holiday.id) === String(holidayId)) || null
}

function populateHolidayEditor(scope, holiday){
  const nameInput = scope === "national" ? nationalHolidayNameInput : companyHolidayNameInput
  const dateInput = scope === "national" ? nationalHolidayDateInput : companyHolidayDateInput
  const saveButton = scope === "national" ? addNationalHolidayButton : addCompanyHolidayButton
  const deleteButton = scope === "national" ? deleteNationalHolidayButton : deleteCompanyHolidayButton

  if(nameInput){
    nameInput.value = holiday?.name || ""
  }
  if(dateInput){
    dateInput.value = holiday?.date || ""
  }
  if(saveButton){
    saveButton.textContent = holiday
      ? scope === "national" ? "Update National Holiday" : "Update Company Holiday"
      : scope === "national" ? "Add National Holiday" : "Add Company Holiday"
  }
  if(deleteButton){
    deleteButton.disabled = !holiday
    deleteButton.classList.toggle("btn-disabled", !holiday)
  }
}

function resetHolidayEditor(scope){
  if(scope === "national"){
    selectedNationalHolidayId = null
  } else {
    selectedCompanyHolidayId = null
  }
  populateHolidayEditor(scope, null)
}

function renderOvertimeDepartmentOptions(){
  if(!overtimeDepartmentInput) return

  const currentValue = overtimeDepartmentInput.value
  overtimeDepartmentInput.innerHTML = ""
  appSettings.departments.forEach((department) => {
    const option = document.createElement("option")
    option.value = department.id
    option.textContent = department.name
    overtimeDepartmentInput.appendChild(option)
  })

  if(currentValue && Array.from(overtimeDepartmentInput.options).some((option) => option.value === currentValue)){
    overtimeDepartmentInput.value = currentValue
  }
  }

function renderOvertimeRoleOptions(){
  if(!overtimeRoleInput) return

  const selectedDepartmentId = overtimeDepartmentInput?.value || ""
  const currentValue = overtimeRoleInput.value
  const roleSet = new Set()

  getEmployeeRecords().forEach((employee) => {
    if(!selectedDepartmentId || String(employee.departmentId) === String(selectedDepartmentId)){
      roleSet.add(employee.roleTitle)
    }
  })

  if(!roleSet.size){
    roleSet.add("Team Member")
  }

  overtimeRoleInput.innerHTML = ""
  Array.from(roleSet).sort().forEach((role) => {
    const option = document.createElement("option")
    option.value = role
    option.textContent = role
    overtimeRoleInput.appendChild(option)
  })

  if(currentValue && Array.from(overtimeRoleInput.options).some((option) => option.value === currentValue)){
    overtimeRoleInput.value = currentValue
  }
  }

function renderOvertimeTab(){
  syncOvertimeRatesFromBackend()
  renderOvertimeDepartmentOptions()
  const selectedRate = appSettings.worktrack.overtimeRates.find((rate) => String(rate.id) === String(selectedOvertimeRateId))

  if(selectedOvertimeRateId && !selectedRate){
    resetOvertimeRateEditor()
  } else if(selectedRate){
    if(overtimeDepartmentInput){
      overtimeDepartmentInput.value = selectedRate.departmentId || ""
    }
    renderOvertimeRoleOptions()
    if(overtimeRoleInput){
      overtimeRoleInput.value = selectedRate.role
    }
    if(overtimeRateInput){
      overtimeRateInput.value = String(selectedRate.rate)
    }
    if(saveOvertimeRateButton){
      saveOvertimeRateButton.textContent = "Update Rate"
    }
    if(deleteOvertimeRateButton){
      deleteOvertimeRateButton.disabled = false
      deleteOvertimeRateButton.classList.remove("btn-disabled")
    }
  } else {
    renderOvertimeRoleOptions()
  }

  if(overtimeRatesBody){
    overtimeRatesBody.innerHTML = appSettings.worktrack.overtimeRates.map((rate) => `
      <tr class="${String(rate.id) === String(selectedOvertimeRateId) ? "selected" : ""}" data-overtime-rate-id="${rate.id}">
        <td>${rate.department}</td>
        <td>${rate.role}</td>
        <td>${getCurrencyFormatter().format(rate.rate)}</td>
        <td>${rate.updatedAt}</td>
      </tr>
    `).join("") || `<tr><td colspan="4">No overtime rates have been configured.</td></tr>`
  }

  if(overtimeHint){
    overtimeHint.textContent = `${appSettings.worktrack.overtimeRates.length} role-based overtime rates are currently configured.`
  }
  }

function renderHolidayTab(){
  syncHolidaysFromBackend()
  if(selectedCompanyHolidayId && !getHolidayByScopeAndId("company", selectedCompanyHolidayId)){
    resetHolidayEditor("company")
  }
  if(selectedNationalHolidayId && !getHolidayByScopeAndId("national", selectedNationalHolidayId)){
    resetHolidayEditor("national")
  }
  if(selectedCompanyHolidayId){
    populateHolidayEditor("company", getHolidayByScopeAndId("company", selectedCompanyHolidayId))
  }
  if(selectedNationalHolidayId){
    populateHolidayEditor("national", getHolidayByScopeAndId("national", selectedNationalHolidayId))
  }
  const holidaySummary = getHolidaySummary()

  if(companyHolidayBody){
    companyHolidayBody.innerHTML = getVisibleCompanyHolidayRecords().map((holiday) => `
      <tr class="${String(holiday.id) === String(selectedCompanyHolidayId) ? "selected" : ""}" data-holiday-id="${holiday.id}" data-holiday-scope="company">
        <td>${holiday.name}</td>
        <td>${holiday.date}</td>
      </tr>
    `).join("") || `<tr><td colspan="2">No company holidays scheduled.</td></tr>`
  }

  if(nationalHolidayBody){
    nationalHolidayBody.innerHTML = getVisibleNationalHolidayRecords().map((holiday) => `
      <tr class="${String(holiday.id) === String(selectedNationalHolidayId) ? "selected" : ""}" data-holiday-id="${holiday.id}" data-holiday-scope="national">
        <td>${holiday.name}</td>
        <td>${holiday.date}</td>
      </tr>
    `).join("") || `<tr><td colspan="2">No national holidays scheduled.</td></tr>`
  }

  if(holidaySummaryText){
    holidaySummaryText.textContent = `${holidaySummary.companyCount} company holidays and ${holidaySummary.nationalCount} national holidays are scheduled.`
  }
  }

function renderWorktrackSection(){
  syncApprovalTemplatesForState(appState)
  document.querySelectorAll(".worktrack-tab").forEach((tab) => tab.classList.remove("active"))
  document.querySelectorAll(".worktrack-tab-content").forEach((content) => content.classList.remove("active-worktrack-tab"))
  document.getElementById(appSettings.worktrack.activeTab || "attendanceTab")?.classList.add("active-worktrack-tab")
  findTargetedTrigger("[data-worktrack-tab-target]", "data-worktrack-tab-target", appSettings.worktrack.activeTab || "attendanceTab")?.classList.add("active")
  renderAttendanceTab()
  renderLeaveManagementTab()
  renderOvertimeTab()
  renderHolidayTab()
  }

function openInsightsTab(tabId){
  syncTargetedNavigation({
    triggerSelector: "[data-insights-tab-target]",
    triggerAttribute: "data-insights-tab-target",
    panelSelector: ".insights-tab-content",
    panelActiveClass: "active-insights-tab",
    activePanelId: tabId
  })
  appSettings.insights.activeTab = tabId
  persistSettings()
  renderInsightsSection()
  scrollContentToTop(tabId)
  }

function getInsightSignals(){
  const employees = getEmployeeRecords()
  const activeEmployees = employees.filter((employee) => employee.status === "ACTIVE")
  const leaveEmployees = employees.filter((employee) => employee.status === "LEAVE")
  const attendanceLogs = getVisibleAttendanceLogRecords()
  const approvedAttendance = attendanceLogs.filter((log) => isAttendanceLogApproved(log))
  const pendingAttendance = attendanceLogs.filter((log) => !isAttendanceLogApproved(log))
  const pendingLeave = getLeaveRequestsByStatus("Pending")
  const activeLeave = getLeaveRequestsByStatus("Active")
  const pendingContracts = getContractsByStatus("Pending")
  const terminatedContracts = getContractsByStatus("Terminated")
  const activeContracts = getContractsByStatus("Active")
  const payrollApproved = appSettings.payroll.approvals.every((approval) => approval.approved)

  return {
    totalEmployees: employees.length,
    activeEmployees: activeEmployees.length,
    leaveEmployees: leaveEmployees.length,
    approvedAttendance: approvedAttendance.length,
    pendingAttendance: pendingAttendance.length,
    pendingLeave: pendingLeave.length,
    activeLeave: activeLeave.length,
    pendingContracts: pendingContracts.length,
    terminatedContracts: terminatedContracts.length,
    activeContracts: activeContracts.length,
    payrollApproved
  }
  }

function getInsightsMetrics(){
  const signals = getInsightSignals()
  const contractExposure = signals.activeContracts + signals.pendingContracts
  const attendanceApprovalRate = signals.approvedAttendance + signals.pendingAttendance
    ? Math.round((signals.approvedAttendance / (signals.approvedAttendance + signals.pendingAttendance)) * 100)
    : 0

  return [
    {
      category: "workforce",
      title: "Active Workforce",
      value: `${signals.activeEmployees}/${signals.totalEmployees}`,
      caption: "Employees currently available for assignments."
    },
    {
      category: "attendance",
      title: "Attendance Approval Rate",
      value: `${attendanceApprovalRate}%`,
      caption: "Approved daily attendance logs in the current cycle."
    },
    {
      category: "leave",
      title: "Pending Leave",
      value: `${signals.pendingLeave}`,
      caption: "Requests waiting for HR and executive review."
    },
    {
      category: "contracts",
      title: "Contract Exposure",
      value: `${contractExposure}`,
      caption: "Active and pending contract obligations being managed."
    },
    {
      category: "contracts",
      title: "Contract Risk",
      value: `${signals.terminatedContracts}`,
      caption: "Terminated contracts that may need replacement planning."
    },
    {
      category: "workforce",
      title: "Payroll Readiness",
      value: signals.payrollApproved ? "Ready" : "Pending",
      caption: "Overall readiness of payroll approvals this cycle."
    }
  ]
  }

function getDepartmentAnalyticsRows(){
  return appSettings.departments.map((department) => {
    const members = getDepartmentMembers(department.name)
    const active = members.filter((employee) => employee.status === "ACTIVE").length
    const onLeave = members.filter((employee) => employee.status === "LEAVE").length
    const contracts = getContractRecords().filter((contract) => {
      if(contract.employeeId){
        const employee = getEmployeeById(contract.employeeId)
        return employee && String(employee.departmentId) === String(department.id)
      }

      return contract.companyName === appSettings.company.name &&
        contract.roleTitle.toLowerCase().includes(department.name.toLowerCase().slice(0, 3))
    }).length

    return {
      name: department.name,
      employees: members.length,
      active,
      onLeave,
      contracts
    }
  })
  }

function getAIInsightCards(){
  const signals = getInsightSignals()
  const cards = []

  if(signals.pendingLeave > 0){
    cards.push({
      category: "Leave",
      title: "Clear pending leave faster",
      body: `There are ${signals.pendingLeave} leave requests waiting. Fast approvals reduce workforce planning uncertainty and avoid last-minute shift gaps.`
    })
  }

  if(signals.pendingAttendance > 0){
    cards.push({
      category: "Attendance",
      title: "Approve attendance before payroll cut-off",
      body: `${signals.pendingAttendance} attendance entries still need approval. Clearing them early will improve payroll accuracy and reduce manual adjustments.`
    })
  }

  if(signals.terminatedContracts > 0){
    cards.push({
      category: "Contracts",
      title: "Replace terminated contract capacity",
      body: `${signals.terminatedContracts} terminated contracts suggest delivery risk. Review affected departments and prepare replacements or renewals where output is critical.`
    })
  }

  if(signals.activeLeave > 0){
    cards.push({
      category: "Employees",
      title: "Plan for employees currently on leave",
      body: `${signals.activeLeave} approved leave cases are active. Consider redistributing workload in the most affected departments to protect deadlines and morale.`
    })
  }

  if(!cards.length){
    cards.push({
      category: "Overall",
      title: "Operations are stable",
      body: "Your current workforce, leave, and contract signals look balanced. Focus on preserving approval discipline and updating role rates as the company grows."
    })
  }

  return cards
  }

function renderAnalyticsTab(){
  if(insightsAnalyticsFilter){
    insightsAnalyticsFilter.value = appSettings.insights.analyticsFilter || "all"
  }

  const filter = appSettings.insights.analyticsFilter || "all"
  const metrics = getInsightsMetrics().filter((metric) => filter === "all" || metric.category === filter)

  if(insightsMetricsGrid){
    insightsMetricsGrid.innerHTML = metrics.map((metric) => `
      <article class="settings-card insights-metric-card">
        <span class="insights-metric-label">${metric.title}</span>
        <strong class="insights-metric-value">${metric.value}</strong>
        <p>${metric.caption}</p>
      </article>
    `).join("")
  }

  if(insightsDepartmentTableBody){
    insightsDepartmentTableBody.innerHTML = getDepartmentAnalyticsRows().map((row) => `
      <tr>
        <td>${row.name}</td>
        <td>${row.employees}</td>
        <td>${row.active}</td>
        <td>${row.onLeave}</td>
        <td>${row.contracts}</td>
      </tr>
    `).join("")
  }

  const signals = getInsightSignals()
  if(insightsRiskWatch){
    insightsRiskWatch.textContent = `${signals.pendingLeave} pending leave requests, ${signals.pendingAttendance} unapproved attendance entries, and ${signals.terminatedContracts} terminated contracts need management attention.`
  }

  if(insightsReadinessText){
    insightsReadinessText.textContent = signals.payrollApproved
      ? "Payroll approvals are complete and the business is operationally ready for the next run."
      : "Payroll still needs final approvals. Prioritize attendance and leave approvals to tighten operational readiness."
  }
  }

function renderAIInsightsTab(){
  if(insightsDecisionFocus){
    insightsDecisionFocus.value = appSettings.insights.decisionFocus || "all"
  }

  const focus = appSettings.insights.decisionFocus || "all"
  const cards = getAIInsightCards().filter((card) => focus === "all" || card.category.toLowerCase() === focus || (focus === "employees" && (card.category === "Leave" || card.category === "Employees")))

  if(aiInsightsCards){
    aiInsightsCards.innerHTML = cards.map((card) => `
      <article class="settings-card ai-insight-card">
        <span class="insight-pill">${card.category}</span>
        <h4>${card.title}</h4>
        <p>${card.body}</p>
      </article>
    `).join("")
  }

  if(aiInsightsSummary){
    aiInsightsSummary.textContent = "HexaMind reviews workforce, leave, attendance, payroll, and contract signals to surface the most practical next moves for business stability."
  }

  if(aiRecommendedAction){
    const primary = cards[0]
    aiRecommendedAction.textContent = primary
      ? `${primary.title}. This is the highest-leverage action from the current company signals.`
      : "No urgent action is recommended right now."
  }
  }

function renderInsightsSection(){
  document.querySelectorAll(".insights-tab").forEach((tab) => tab.classList.remove("active"))
  document.querySelectorAll(".insights-tab-content").forEach((content) => content.classList.remove("active-insights-tab"))
  document.getElementById(appSettings.insights.activeTab || "analyticsTab")?.classList.add("active-insights-tab")
  findTargetedTrigger("[data-insights-tab-target]", "data-insights-tab-target", appSettings.insights.activeTab || "analyticsTab")?.classList.add("active")
  renderAnalyticsTab()
  renderAIInsightsTab()
  }

function hasLiveBackendSession(){
  return isAuthenticatedFromState(appState) && !String(appState.auth.token || "").startsWith("mock-token:")
}

function normalizeFinancialRuleScopeForUi(scope){
  return String(scope || "").toLowerCase() === "employee" ? "individual" : String(scope || "company").toLowerCase()
}

function normalizeFinancialRuleScopeForBackend(scope){
  return String(scope || "").toLowerCase() === "individual" ? "employee" : String(scope || "company").toLowerCase()
}

function normalizeFinancialRuleValueTypeForUi(valueType){
  return String(valueType || "").toLowerCase() === "flat_amount" ? "flat" : "percentage"
}

function normalizeFinancialRuleValueTypeForBackend(valueType){
  return String(valueType || "").toLowerCase() === "percentage" ? "percentage" : "flat_amount"
}

function getFinancialTargetOptions(scope){
  const normalizedScope = normalizeFinancialRuleScopeForUi(scope)

  if(normalizedScope === "company"){
    const activeCompany = getActiveCompany()
    return [{
      value: activeCompany?.id || appSettings.company.name,
      label: activeCompany?.name || appSettings.company.name
    }]
  }

  if(normalizedScope === "department"){
    return appSettings.departments.map((department) => ({
      value: department.id,
      label: department.name
    }))
  }

  return getEmployeeRecords().map((employee) => ({
    value: employee.id,
    label: employee.fullName
  }))
}

function getFinancialIncentiveTargetLabel(item){
  const normalizedScope = normalizeFinancialRuleScopeForUi(item?.scope)

  if(normalizedScope === "company"){
    return getActiveCompany()?.name || appSettings.company.name
  }

  if(normalizedScope === "department"){
    return getDepartmentById(item?.targetId)?.name || item?.target || "Unassigned"
  }

  return getEmployeeById(item?.targetId)?.fullName || item?.target || "Unassigned"
}

function applyBackendFinancialRulesToState(financialRules = [], payeConfiguration = null, statutoryConfiguration = null){
  const activeRules = financialRules.filter((rule) => String(rule?.status || "active").toLowerCase() !== "inactive")
  const currentFinancials = appSettings.financials
  const normalizedStatutory = normalizeStatutoryConfiguration({
    paye: {
      payeBands: payeConfiguration?.paye_bands?.map((band) => ({
        upTo: band?.up_to === null || band?.up_to === undefined ? Infinity : Number(band.up_to),
        rate: Number(band?.rate || 0)
      })) || statutoryConfiguration?.paye?.paye_bands?.map((band) => ({
        upTo: band?.up_to === null || band?.up_to === undefined ? Infinity : Number(band.up_to),
        rate: Number(band?.rate || 0)
      })) || currentFinancials.statutory?.paye?.payeBands,
      personalRelief: payeConfiguration?.personal_relief
        ?? statutoryConfiguration?.paye?.personal_relief
        ?? currentFinancials.statutory?.paye?.personalRelief
    },
    shif: {
      employeeRate: statutoryConfiguration?.shif?.employee_rate ?? currentFinancials.statutory?.shif?.employeeRate,
      minimumContribution: statutoryConfiguration?.shif?.minimum_contribution ?? currentFinancials.statutory?.shif?.minimumContribution
    },
    nssf: {
      employeeRate: statutoryConfiguration?.nssf?.employee_rate ?? currentFinancials.statutory?.nssf?.employeeRate,
      lowerEarningsLimit: statutoryConfiguration?.nssf?.lower_earnings_limit ?? currentFinancials.statutory?.nssf?.lowerEarningsLimit,
      upperEarningsLimit: statutoryConfiguration?.nssf?.upper_earnings_limit ?? currentFinancials.statutory?.nssf?.upperEarningsLimit
    },
    housingLevy: {
      employeeRate: statutoryConfiguration?.housing_levy?.employee_rate ?? currentFinancials.statutory?.housingLevy?.employeeRate
    }
  })
  const nextCustomDeductions = []
  const nextIncentives = []

  activeRules.forEach((rule) => {
    const ruleType = String(rule.rule_type || "").toLowerCase()
    const numericValue = Number(rule.value || 0)

    if(ruleType === "custom_deduction"){
      nextCustomDeductions.push({
        id: rule.id,
        backendRuleId: rule.id,
        name: rule.name,
        type: normalizeFinancialRuleValueTypeForUi(rule.value_type),
        value: numericValue
      })
      return
    }

    if(ruleType === "bonus" || ruleType === "incentive"){
      const scope = normalizeFinancialRuleScopeForUi(rule.scope)
      nextIncentives.push({
        id: rule.id,
        backendRuleId: rule.id,
        name: rule.name,
        type: ruleType === "bonus" ? "Bonus" : "Incentive",
        scope,
        targetId: rule.target_id || "",
        target: "",
        taxable: rule.taxable !== false,
        incomeCategory: rule.income_category || (ruleType === "bonus" ? "bonus" : "incentive"),
        amount: numericValue
      })
    }
  })

  appSettings.financials = {
    ...currentFinancials,
    statutory: normalizedStatutory,
    customDeductions: nextCustomDeductions,
    incentives: nextIncentives
  }
}

async function syncFinancialRulesFromBackend({ force = false, rerender = true } = {}){
  if(!hasLiveBackendSession() || !window.HexaPayApi?.getFinancialRules){
    financialRuleSyncState.companyId = ""
    return null
  }

  const companyId = getActiveCompany()?.id
  if(!companyId){
    return null
  }

  if(!force && financialRuleSyncState.companyId === companyId){
    return null
  }

  if(financialRuleSyncState.inFlight){
    return financialRuleSyncState.inFlight
  }

  financialRuleSyncState.inFlight = (async () => {
    try{
      const payload = await window.HexaPayApi.getFinancialRules()
      applyBackendFinancialRulesToState(
        payload?.financial_rules || [],
        payload?.paye_configuration || null,
        payload?.statutory_configuration || null
      )
      applyBackendOvertimeRatesToState(payload?.financial_rules || [])
      financialRuleSyncState.companyId = companyId
      if(rerender){
        renderFinancialsSection()
      }
      return payload
    } catch (error){
      console.error("Failed to sync financial rules from backend.", error)
      return null
    } finally {
      financialRuleSyncState.inFlight = null
    }
  })()

  return financialRuleSyncState.inFlight
}

async function upsertStatutoryFinancialRule(ruleType, name, value){
  if(!hasLiveBackendSession() || !window.HexaPayApi){
    return null
  }

  let backendRuleId = appSettings.financials.statutory?.backendRuleIds?.[ruleType]

  if(!backendRuleId){
    try{
      const payload = await window.HexaPayApi.getFinancialRules()
      backendRuleId = payload?.financial_rules?.find((rule) =>
        String(rule?.rule_type || "").toLowerCase() === String(ruleType || "").toLowerCase() &&
        String(rule?.status || "active").toLowerCase() !== "inactive"
      )?.id || ""
    } catch (error){
      console.error(`Failed to look up existing ${ruleType} rule before save.`, error)
    }
  }

  const payload = {
    rule_type: ruleType,
    name,
    value_type: "percentage",
    value: Number(value || 0),
    scope: "company",
    status: "active"
  }

  const response = backendRuleId
    ? await window.HexaPayApi.updateFinancialRule(backendRuleId, payload)
    : await window.HexaPayApi.createFinancialRule(payload)

  return response?.financial_rule || null
}

function openFinancialsTab(tabId){
  syncTargetedNavigation({
    triggerSelector: "[data-financials-tab-target]",
    triggerAttribute: "data-financials-tab-target",
    panelSelector: ".financials-tab-content",
    panelActiveClass: "active-financials-tab",
    activePanelId: tabId
  })
  appSettings.financials.activeTab = tabId
  persistSettings()
  renderFinancialsSection()
  scrollContentToTop(tabId)
  }

function getFinancialEmployeeRows(){
  return getEmployeesByStatuses(["ACTIVE", "LEAVE"])
  }

function getFilteredFinancialEmployeeTargets(){
  const search = String(appSettings.financials.employeeSearch || "").trim().toLowerCase()
  return getFinancialEmployeeRows().filter((employee) => {
    if(!search){
      return true
    }

    const employeeName = String(getEmployeeDisplayName(employee) || "").toLowerCase()
    const departmentName = String(getEmployeeDepartmentName(employee) || "").toLowerCase()
    return employeeName.includes(search) || departmentName.includes(search)
  })
}

function getSelectedFinancialEmployee(){
  const selectedEmployeeId = String(appSettings.financials.selectedEmployeeId || "").trim()
  if(!selectedEmployeeId){
    return null
  }

  return getFinancialEmployeeRows().find((employee) => String(employee.id) === selectedEmployeeId) || null
}

function renderFinancialEmployeeRuleEditor(){
  if(financialEmployeeSearch){
    financialEmployeeSearch.value = appSettings.financials.employeeSearch || ""
  }

  if(financialEmployeeSelect){
    const currentValue = String(appSettings.financials.selectedEmployeeId || "")
    const employees = getFilteredFinancialEmployeeTargets()
    financialEmployeeSelect.innerHTML = ""

    employees.forEach((employee) => {
      const option = document.createElement("option")
      option.value = employee.id
      option.textContent = `${getEmployeeDisplayName(employee)} • ${getEmployeeDepartmentName(employee)}`
      financialEmployeeSelect.appendChild(option)
    })

    const nextValue = employees.some((employee) => String(employee.id) === currentValue)
      ? currentValue
      : employees[0]?.id || ""

    appSettings.financials.selectedEmployeeId = nextValue
    if(nextValue){
      financialEmployeeSelect.value = nextValue
    }
  }

  const employee = getSelectedFinancialEmployee()
  const financialProfile = normalizeEmployeeFinancialProfile(employee?.financialProfile)

  setTaxFinancialButtonState(financialEmployeeApplyTaxButton, financialProfile.applyTaxFinancials)
  setTaxFinancialVisibility(financialEmployeeTaxOptions, financialProfile.applyTaxFinancials)

  if(financialEmployeeApplyPaye){
    financialEmployeeApplyPaye.checked = financialProfile.statutory.paye
  }
  if(financialEmployeeApplyShif){
    financialEmployeeApplyShif.checked = financialProfile.statutory.shif
  }
  if(financialEmployeeApplyNssf){
    financialEmployeeApplyNssf.checked = financialProfile.statutory.nssf
  }
  if(financialEmployeeApplyHousingLevy){
    financialEmployeeApplyHousingLevy.checked = financialProfile.statutory.housingLevy
  }

  if(financialEmployeeRuleSummary){
    if(!employee){
      financialEmployeeRuleSummary.textContent = "Search and select an employee to manage individual statutory deductions."
    } else if(!financialProfile.applyTaxFinancials){
      financialEmployeeRuleSummary.textContent = `${getEmployeeDisplayName(employee)} currently has individual statutory deductions switched off.`
    } else {
      financialEmployeeRuleSummary.textContent = `${getEmployeeDisplayName(employee)} is set to apply PAYE ${financialProfile.statutory.paye ? "on" : "off"}, SHIF ${financialProfile.statutory.shif ? "on" : "off"}, NSSF ${financialProfile.statutory.nssf ? "on" : "off"}, and Housing Levy ${financialProfile.statutory.housingLevy ? "on" : "off"}.`
    }
  }
}

function getApplicableIncentives(employee){
  const employeeName = getEmployeeDisplayName(employee)
  const department = getEmployeeDepartmentName(employee)
  const employeeId = String(employee?.id || "")
  const departmentId = String(employee?.departmentId || "")
  return appSettings.financials.incentives.filter((item) => {
    const scope = normalizeFinancialRuleScopeForUi(item.scope)

    if(scope === "company"){
      return true
    }
    if(scope === "department"){
      return String(item.targetId || "") === departmentId ||
        item.target === department ||
        item.target === department.toUpperCase()
    }
    return String(item.targetId || "") === employeeId || item.target === employeeName
  })
  }

function calculateEmployeeFinancials(employee){
  const salary = Number(employee.salaryAmount || 0)
  const incentives = getApplicableIncentives(employee)
  const bonusTotal = incentives.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const values = calculateCompensationFinancials({
    salaryAmount: salary,
    financialProfile: employee.financialProfile,
    incentiveAmount: bonusTotal,
    incentives
  })

  return {
    salary,
    bonusTotal,
    grossSalary: values.grossSalary,
    taxablePay: values.taxablePay,
    paye: values.paye,
    shif: values.shif,
    nssf: values.nssf,
    housingLevy: values.housingLevy,
    custom: values.custom,
    totalDeductions: values.totalDeductions,
    loanDeduction: values.loanDeduction,
    net: values.net
  }
  }

function renderFinancialIncentiveTargets(){
  if(!financialIncentiveTarget || !financialIncentiveScope) return

  const scope = financialIncentiveScope.value
  const currentValue = financialIncentiveTarget.value
  financialIncentiveTarget.innerHTML = ""
  const targets = getFinancialTargetOptions(scope)

  targets.forEach((target) => {
    const option = document.createElement("option")
    option.value = String(target.value)
    option.textContent = target.label
    financialIncentiveTarget.appendChild(option)
  })

  if(currentValue && Array.from(financialIncentiveTarget.options).some((option) => option.value === currentValue)){
    financialIncentiveTarget.value = currentValue
  }
  }

function renderFinancialReportDepartmentOptions(){
  if(!financialReportDepartment) return

  const currentValue = appSettings.financials.reportDepartment || ""
  financialReportDepartment.innerHTML = `<option value="">All Departments</option>`
  appSettings.departments.forEach((department) => {
    const option = document.createElement("option")
    option.value = department.name
    option.textContent = department.name
    financialReportDepartment.appendChild(option)
  })
  financialReportDepartment.value = currentValue
  }

function renderFinancialRulesTab(){
  syncFinancialRulesFromBackend()
  const statutory = appSettings.financials.statutory
  const calculatorState = appSettings.financials.calculator || (appSettings.financials.calculator = {
    grossSalary: "",
    result: null,
    validationMessage: ""
  })
  if(financialPayeBandsList){
    const payeConfiguration = normalizePayeConfiguration(statutory.paye || {})
    financialPayeBandsList.innerHTML = payeConfiguration.payeBands.map((band, index) => {
      const previousLimit = index === 0
        ? 0
        : Number(payeConfiguration.payeBands[index - 1]?.upTo || 0)
      const rateLabel = `${Number((band.rate || 0) * 100).toFixed(((band.rate || 0) * 100) % 1 === 0 ? 0 : 1)}%`

      if(Number.isFinite(band.upTo)){
        const lowerBound = index === 0 ? 0 : previousLimit + 1
        return `<p>${getCurrencyFormatter().format(lowerBound)} to ${getCurrencyFormatter().format(band.upTo)} at ${rateLabel}</p>`
      }

      return `<p>Above ${getCurrencyFormatter().format(previousLimit)} at ${rateLabel}</p>`
    }).join("")
  }
  if(financialPayeReliefAmount){
    financialPayeReliefAmount.textContent = `Personal relief: ${getCurrencyFormatter().format(Number(statutory.paye?.personalRelief || 0))} per month.`
  }
  if(financialShifRule){
    financialShifRule.textContent = `${Number((Number(statutory.shif?.employeeRate || 0) * 100)).toFixed(2)}% of gross salary with a minimum of ${getCurrencyFormatter().format(Number(statutory.shif?.minimumContribution || 0))}.`
  }
  if(financialNssfRule){
    financialNssfRule.textContent = `${Number((Number(statutory.nssf?.employeeRate || 0) * 100)).toFixed(2)}% employee contribution on pensionable pay from ${getCurrencyFormatter().format(Number(statutory.nssf?.lowerEarningsLimit || 0))} to ${getCurrencyFormatter().format(Number(statutory.nssf?.upperEarningsLimit || 0))}.`
  }
  if(financialHousingLevyRule){
    financialHousingLevyRule.textContent = `${Number((Number(statutory.housingLevy?.employeeRate || 0) * 100)).toFixed(2)}% of gross salary.`
  }

  if(payeCalculatorGrossSalary){
    const nextGrossSalaryValue = calculatorState.grossSalary || ""
    if(document.activeElement !== payeCalculatorGrossSalary && payeCalculatorGrossSalary.value !== nextGrossSalaryValue){
      payeCalculatorGrossSalary.value = nextGrossSalaryValue
    }
  }
  if(payeCalculatorMessage){
    payeCalculatorMessage.textContent = calculatorState.validationMessage || "Preview PAYE and statutory deductions without saving a payroll record."
  }
  if(payeCalculatorResults){
    const result = calculatorState.result
    payeCalculatorResults.innerHTML = result ? [
      ["Gross Salary", result.grossSalary],
      ["SHIF", result.deductions.shif],
      ["NSSF", result.deductions.nssf],
      ["Housing Levy", result.deductions.housingLevy],
      ["Taxable Pay", result.taxablePay],
      ["PAYE", result.deductions.paye],
      ["Total Deductions", result.deductions.totalEmployeeDeductions],
      ["Net Pay", result.netPay]
    ].map(([label, value]) => `
      <div class="structure-change-item">
        <div>
          <strong>${label}</strong>
          <span>${getCurrencyFormatter().format(Number(value || 0))}</span>
        </div>
      </div>
    `).join("") : ""
  }

  if(customDeductionList){
    if(!appSettings.financials.customDeductions.length){
      customDeductionList.innerHTML = `<div class="structure-empty-state">No custom deductions yet. Add one to extend the payroll rules.</div>`
    } else {
      customDeductionList.innerHTML = appSettings.financials.customDeductions.map((item) => `
        <div class="structure-change-item">
          <div>
            <strong>${item.name}</strong>
            <span>${item.type === "percentage" ? `${item.value}% of gross` : `${getCurrencyFormatter().format(Number(item.value || 0))} flat per employee`}</span>
          </div>
          <div class="structure-change-meta">
            <button type="button" class="structure-remove-button" data-custom-deduction-id="${item.backendRuleId || item.id}">Remove</button>
          </div>
        </div>
      `).join("")
    }
  }

  if(financialRulesSummary){
    const employees = getFinancialEmployeeRows()
    const totals = employees.reduce((acc, row) => {
      const values = calculateEmployeeFinancials(row)
      acc.paye += values.paye
      acc.shif += values.shif
      acc.nssf += values.nssf
      acc.housingLevy += values.housingLevy
      acc.custom += values.custom
      return acc
    }, { paye: 0, shif: 0, nssf: 0, housingLevy: 0, custom: 0 })

    financialRulesSummary.textContent = `Current rules estimate ${getCurrencyFormatter().format(totals.paye)} PAYE, ${getCurrencyFormatter().format(totals.shif)} SHIF, ${getCurrencyFormatter().format(totals.nssf)} NSSF, ${getCurrencyFormatter().format(totals.housingLevy)} Housing Levy, and ${getCurrencyFormatter().format(totals.custom)} in custom deductions for active payroll.`
  }

  renderFinancialEmployeeRuleEditor()
  }

function renderFinancialIncentivesTab(){
  renderFinancialIncentiveTargets()

  if(financialIncentivesBody){
    financialIncentivesBody.innerHTML = appSettings.financials.incentives.map((item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.type} - ${item.taxable === false ? "Non-taxable" : "Taxable"}</td>
        <td>${normalizeFinancialRuleScopeForUi(item.scope)}</td>
        <td>${getFinancialIncentiveTargetLabel(item)}</td>
        <td>${getCurrencyFormatter().format(Number(item.amount || 0))}</td>
      </tr>
    `).join("") || `<tr><td colspan="5">No incentives configured yet.</td></tr>`
  }

  if(financialIncentiveSummary){
    const total = appSettings.financials.incentives.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const taxableCount = appSettings.financials.incentives.filter((item) => item.taxable !== false).length
    financialIncentiveSummary.textContent = `${appSettings.financials.incentives.length} active bonus or incentive rules are configured, worth ${getCurrencyFormatter().format(total)} when fully applied. ${taxableCount} currently contribute to taxable pay.`
  }
  }

function renderFinancialReportsTab(){
  renderFinancialReportDepartmentOptions()

  const departmentFilter = appSettings.financials.reportDepartment || ""
  const employees = getFinancialEmployeeRows().filter((employee) => !departmentFilter || getEmployeeDepartmentName(employee) === departmentFilter)
  const totals = employees.reduce((acc, employee) => {
    const values = calculateEmployeeFinancials(employee)
    acc.gross += values.grossSalary
    acc.taxable += values.taxablePay
    acc.paye += values.paye
    acc.shif += values.shif
    acc.nssf += values.nssf
    acc.housingLevy += values.housingLevy
    acc.custom += values.custom
    acc.net += values.net
    return acc
  }, { gross: 0, taxable: 0, paye: 0, shif: 0, nssf: 0, housingLevy: 0, custom: 0, net: 0 })

  if(financialReportMetrics){
    financialReportMetrics.innerHTML = [
      ["Gross Payroll", totals.gross],
      ["Taxable Pay", totals.taxable],
      ["PAYE Total", totals.paye],
      ["SHIF Total", totals.shif],
      ["NSSF Total", totals.nssf],
      ["Housing Levy", totals.housingLevy],
      ["Custom Total", totals.custom],
      ["Net Pay", totals.net]
    ].map(([label, value]) => `
      <article class="settings-card insights-metric-card">
        <span class="insights-metric-label">${label}</span>
        <strong class="insights-metric-value">${getCurrencyFormatter().format(Number(value))}</strong>
      </article>
    `).join("")
  }

  if(financialTaxReportBody){
    financialTaxReportBody.innerHTML = employees.map((employee) => {
      const values = calculateEmployeeFinancials(employee)
      return `
        <tr>
          <td>${getEmployeeDisplayName(employee)}</td>
          <td>${getCurrencyFormatter().format(values.grossSalary)}</td>
          <td>${getCurrencyFormatter().format(values.taxablePay)}</td>
          <td>${getCurrencyFormatter().format(values.paye)}</td>
          <td>${getCurrencyFormatter().format(values.shif)}</td>
          <td>${getCurrencyFormatter().format(values.nssf)}</td>
          <td>${getCurrencyFormatter().format(values.housingLevy)}</td>
          <td>${getCurrencyFormatter().format(values.custom)}</td>
          <td>${getCurrencyFormatter().format(values.net)}</td>
        </tr>
      `
    }).join("") || `<tr><td colspan="9">No employees match the current report filter.</td></tr>`
  }

  if(financialTaxSummary){
    financialTaxSummary.textContent = `${employees.length} employees are included in this tax report with ${getCurrencyFormatter().format(totals.gross)} gross payroll and ${getCurrencyFormatter().format(totals.net)} projected net pay.`
  }

  if(financialComplianceText){
    const pendingPayroll = getFinancialEmployeeRows().filter((employee) => String(employee.payrollStatus || "").toLowerCase() === "pending").length
    financialComplianceText.textContent = `${pendingPayroll} employee payroll records are still pending processing. Review those entries before submitting statutory filings.`
  }
  }

function renderFinancialLedgerTab(){
  const employees = getFinancialEmployeeRows()
  const totals = employees.reduce((acc, row) => {
    const values = calculateEmployeeFinancials(row)
    acc.salary += values.salary
    acc.bonuses += values.bonusTotal
    acc.taxable += values.taxablePay
    acc.paye += values.paye
    acc.shif += values.shif
    acc.nssf += values.nssf
    acc.housingLevy += values.housingLevy
    acc.custom += values.custom
    acc.net += values.net
    return acc
  }, { salary: 0, bonuses: 0, taxable: 0, paye: 0, shif: 0, nssf: 0, housingLevy: 0, custom: 0, net: 0 })

  if(financialLedgerMetrics){
    financialLedgerMetrics.innerHTML = [
      ["Base Salaries", totals.salary],
      ["Bonuses", totals.bonuses],
      ["Taxable Pay", totals.taxable],
      ["Deductions", totals.paye + totals.shif + totals.nssf + totals.housingLevy + totals.custom],
      ["Net Payroll", totals.net]
    ].map(([label, value]) => `
      <article class="settings-card insights-metric-card">
        <span class="insights-metric-label">${label}</span>
        <strong class="insights-metric-value">${getCurrencyFormatter().format(Number(value))}</strong>
      </article>
    `).join("")
  }

  if(financialLedgerBody){
    financialLedgerBody.innerHTML = [
      ["Gross Salaries", totals.salary, "Core employee salary obligation before incentives and deductions."],
      ["Bonuses and Incentives", totals.bonuses, "All configured incentive rules applied to current staff."],
      ["Taxable Pay", totals.taxable, "Taxable income used for monthly PAYE computation."],
      ["PAYE Payable", totals.paye, "Projected PAYE remittance for this payroll cycle."],
      ["SHIF Payable", totals.shif, "Projected employee SHIF deductions."],
      ["NSSF Payable", totals.nssf, "Projected employee NSSF deductions."],
      ["Housing Levy", totals.housingLevy, "Projected employee Housing Levy deductions."],
      ["Custom Deductions", totals.custom, "Additional configured payroll deductions."],
      ["Net Payroll Cash Out", totals.net, "Estimated payroll cash requirement after all deductions."]
    ].map(([entry, value, notes]) => `
      <tr>
        <td>${entry}</td>
        <td>${getCurrencyFormatter().format(Number(value))}</td>
        <td>${notes}</td>
      </tr>
    `).join("")
  }

  if(financialLedgerNarrative){
    financialLedgerNarrative.textContent = `Financially, the current payroll cycle points to ${getCurrencyFormatter().format(totals.net)} in net payouts after ${getCurrencyFormatter().format(totals.paye + totals.shif + totals.nssf + totals.housingLevy + totals.custom)} in total deductions and remittances.`
  }
  }

function renderFinancialsSection(){
  syncFinancialRulesFromBackend()
  document.querySelectorAll(".financials-tab").forEach((tab) => tab.classList.remove("active"))
  document.querySelectorAll(".financials-tab-content").forEach((content) => content.classList.remove("active-financials-tab"))
  document.getElementById(appSettings.financials.activeTab || "financialRulesTab")?.classList.add("active-financials-tab")
  findTargetedTrigger("[data-financials-tab-target]", "data-financials-tab-target", appSettings.financials.activeTab || "financialRulesTab")?.classList.add("active")
  renderFinancialRulesTab()
  renderFinancialIncentivesTab()
  renderFinancialReportsTab()
  renderFinancialLedgerTab()
  }

function scrollContentToTop(targetId){
const content = document.querySelector(".content")
const target = targetId ? document.getElementById(targetId) : null

const resetScroll = () => {
  if(content){
    content.scrollTop = 0
    content.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }

  if(document.scrollingElement){
    document.scrollingElement.scrollTop = 0
  }

  if(document.documentElement){
    document.documentElement.scrollTop = 0
  }

  if(document.body){
    document.body.scrollTop = 0
  }

  if(target){
    target.scrollTop = 0
    target.scrollIntoView({ block: "start", behavior: "auto" })
  }
}

resetScroll()
setTimeout(resetScroll, 0)
setTimeout(resetScroll, 50)
setTimeout(resetScroll, 150)
setTimeout(resetScroll, 300)
requestAnimationFrame(() => requestAnimationFrame(resetScroll))
}

function forceContentReset(sectionId){
const content = document.querySelector(".content")
if(!content) return

content.style.overflow = "hidden"
scrollContentToTop(sectionId)

setTimeout(() => {
  content.style.overflow = "auto"
  scrollContentToTop(sectionId)
}, 30)
}

companyBtn.onclick = () => {

dropdown.style.display =
dropdown.style.display === "block"
? "none"
: "block"

}

async function selectCompany(companyId){
  const selectedCompany = getSelectableCompanies().find((company) => String(company.id) === String(companyId))
  dropdown.style.display = "none"

if(!selectedCompany) return

try{
  if(window.HexaPayApi?.switchCompany){
    await window.HexaPayApi.switchCompany(selectedCompany.id)
  } else {
    appState.company.activeCompanyId = selectedCompany.id
  }
} catch (error){
  console.error("Company switch failed.", error)
  setProfileAuthMessage(error?.payload?.error?.message || error?.message || "Company switch failed.", "error")
  renderProfileState()
  return
}

appState.company.activeCompanyId = selectedCompany.id
selectedCompanyLogo = ""
selectedSignupCompanyLogo = ""
resetBackendDrivenViewSyncState()
persistSettings()
await syncOverviewDataFromBackend({ force: true })
renderCompanySettings()
renderCompanyDropdown()
renderProfileState()
updateDashboardMetrics()
renderWorkforceSection()
renderWorktrackSection()
renderPayrollSection()
addActivity("Company switched", `Workspace focus moved to ${selectedCompany.name}.`)

}

function openSettingsWindow(){
if(!settingsWindow) return
closeAllOverlayWindows()
setOverlayOpenState(settingsWindow, true, { lockBody: true })
}

function closeSettingsWindow(){
setOverlayOpenState(settingsWindow, false, { lockBody: true })
}

function openNotificationsWindow(){
if(!notificationsWindow) return
closeAllOverlayWindows()
setOverlayOpenState(notificationsWindow, true, { lockBody: true })
}

function closeNotificationsWindow(){
setOverlayOpenState(notificationsWindow, false, { lockBody: true })
}

function showNotificationPopup(title, message){
  if(!notificationToastHost){
    return
  }

  const toast = document.createElement("article")
  toast.className = "notification-toast"
  toast.innerHTML = `
    <div class="notification-toast-badge"><i class="fa-solid fa-circle-check"></i></div>
    <div class="notification-toast-copy">
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `

  notificationToastHost.appendChild(toast)
  requestAnimationFrame(() => {
    toast.classList.add("is-visible")
  })

  window.setTimeout(() => {
    toast.classList.remove("is-visible")
    window.setTimeout(() => {
      toast.remove()
    }, 220)
  }, 3200)
}

function openProfileWindow(){
  if(!profileWindow) return
  closeAllOverlayWindows()
  renderProfileState()
  setOverlayOpenState(profileWindow, true, { lockBody: true })
}

function closeProfileWindow(){
  setOverlayOpenState(profileWindow, false, { lockBody: true })
  }

function openAddCompanyWindow(){
dropdown.style.display = "none"
setProfileAuthMessage("Create a new company account from the sign up form, or sign in to switch to a company you already belong to.", "neutral")
renderProfileState()
openProfileWindow()
if(profileSignupCompany){
  profileSignupCompany.focus()
}
}

function bindCriticalAuthButtons(){
  if(profileSignupButton && profileSignupButton.dataset.authBound !== "true"){
    profileSignupButton.dataset.authBound = "true"
    profileSignupButton.onclick = handleProfileSignupButtonClick
  }

  if(profileLoginButton && profileLoginButton.dataset.authBound !== "true"){
    profileLoginButton.dataset.authBound = "true"
    profileLoginButton.onclick = handleProfileLoginButtonClick
  }

  if(profileUserSignupButton && profileUserSignupButton.dataset.authBound !== "true"){
    profileUserSignupButton.dataset.authBound = "true"
    profileUserSignupButton.onclick = handleProfileUserSignupButtonClick
  }

  if(profileUserLoginButton && profileUserLoginButton.dataset.authBound !== "true"){
    profileUserLoginButton.dataset.authBound = "true"
    profileUserLoginButton.onclick = handleProfileUserLoginButtonClick
  }
}

bindCriticalAuthButtons()

if(settingsToggle){
settingsToggle.addEventListener("click", openSettingsWindow)
}

if(settingsClose){
settingsClose.addEventListener("click", closeSettingsWindow)
}

if(notificationsToggle){
notificationsToggle.addEventListener("click", openNotificationsWindow)
}

if(notificationsClose){
notificationsClose.addEventListener("click", closeNotificationsWindow)
}

if(profileToggle){
profileToggle.addEventListener("click", openProfileWindow)
}

if(profileClose){
profileClose.addEventListener("click", closeProfileWindow)
}

if(addCompanyTrigger){
addCompanyTrigger.addEventListener("click", openAddCompanyWindow)
}

if(settingsWindow){
settingsWindow.addEventListener("click", (event) => {
if(event.target === settingsWindow){
closeSettingsWindow()
}
})
}

if(notificationsWindow){
notificationsWindow.addEventListener("click", (event) => {
if(event.target === notificationsWindow){
closeNotificationsWindow()
}
})
}

if(profileWindow){
profileWindow.addEventListener("click", (event) => {
if(event.target === profileWindow){
closeProfileWindow()
}
})
}

if(employeeModal){
employeeModal.addEventListener("click", (event) => {
if(event.target === employeeModal){
closeModal()
}
})
}

if(employeeProfileWindow){
employeeProfileWindow.addEventListener("click", (event) => {
if(event.target === employeeProfileWindow){
closeProfileModal()
}
})
}

if(departmentModal){
departmentModal.addEventListener("click", (event) => {
if(event.target === departmentModal){
closeDepartmentModal()
}
})
}

if(departmentProfileWindow){
departmentProfileWindow.addEventListener("click", (event) => {
if(event.target === departmentProfileWindow){
closeDepartmentProfile()
}
})
}

if(contractModal){
contractModal.addEventListener("click", (event) => {
if(event.target === contractModal){
closeContractModal()
}
})
}

if(contractProfileWindow){
contractProfileWindow.addEventListener("click", (event) => {
if(event.target === contractProfileWindow){
closeContractProfile()
}
})
}

if(departmentDeleteConfirmWindow){
departmentDeleteConfirmWindow.addEventListener("click", (event) => {
if(event.target === departmentDeleteConfirmWindow){
closeDepartmentDeleteConfirm()
}
})
}

document.addEventListener("keydown", (event) => {
if(event.key === "Escape" && settingsWindow?.classList.contains("open")){
closeSettingsWindow()
}

if(event.key === "Escape" && notificationsWindow?.classList.contains("open")){
closeNotificationsWindow()
}

if(event.key === "Escape" && profileWindow?.classList.contains("open")){
closeProfileWindow()
}

if(event.key === "Escape" && employeeModal?.classList.contains("open")){
closeModal()
}

if(event.key === "Escape" && employeeProfileWindow?.classList.contains("open")){
closeProfileModal()
}

if(event.key === "Escape" && departmentModal?.classList.contains("open")){
closeDepartmentModal()
}

if(event.key === "Escape" && departmentProfileWindow?.classList.contains("open")){
closeDepartmentProfile()
}

if(event.key === "Escape" && departmentDeleteConfirmWindow?.classList.contains("open")){
closeDepartmentDeleteConfirm()
}

if(event.key === "Escape" && contractModal?.classList.contains("open")){
closeContractModal()
}

if(event.key === "Escape" && contractProfileWindow?.classList.contains("open")){
closeContractProfile()
}
})


// LIVE CLOCK

function updateClock(){

const now = new Date()

document.getElementById("date").textContent =
now.toDateString()

document.getElementById("time").textContent =
now.toLocaleTimeString()

}

updateClock()
setInterval(updateClock,1000)


function getOverviewPayrollSeries(){
const payrollByMonth = new Map()

const payrollRuns = getPayrollRuns()

if(payrollRuns.length){
  payrollRuns.forEach((run) => {
    const generatedMonth = String(run.generatedAt || "").slice(0, 7)
    const periodMonth = /^\d{4}-\d{2}$/.test(String(run.period || "")) ? String(run.period) : generatedMonth
    const monthKey = periodMonth || generatedMonth
    if(!monthKey){
      return
    }

    payrollByMonth.set(monthKey, (payrollByMonth.get(monthKey) || 0) + Number(run.totals?.netPay || 0))
  })
} else {
  getEmployeeRecords().forEach((employee) => {
    ;(employee.salaryHistory || []).forEach((entry) => {
      if(!entry?.date){
        return
      }

      const monthKey = entry.date.slice(0, 7)
      const netValue = Number(entry.net || (entry.gross - entry.deductions + entry.allowance) || 0)
      payrollByMonth.set(monthKey, (payrollByMonth.get(monthKey) || 0) + netValue)
    })
  })
}

const monthKeys = Array.from(payrollByMonth.keys()).sort().slice(-overviewPayrollRangeMonths)
if(!monthKeys.length){
  return {
    labels: ["No Data"],
    values: [0]
  }
}

return {
  labels: monthKeys.map((monthKey) => {
    const [year, month] = monthKey.split("-").map(Number)
    return new Date(year, month - 1, 1).toLocaleString("en-US", { month: "short" })
  }),
  values: monthKeys.map((monthKey) => Math.round(payrollByMonth.get(monthKey) || 0))
}
}

function getOverviewWorkforceSeries(){
const counts = new Map()

if(overviewWorkforceMode === "employmentType"){
  getEmployeeRecords().forEach((employee) => {
    const type = employee.paymentType || employee.employmentType || "Unspecified"
    counts.set(type, (counts.get(type) || 0) + 1)
  })
} else if(overviewWorkforceMode === "status"){
  getEmployeeRecords().forEach((employee) => {
    const status = employee.status || "Unknown"
    counts.set(status, (counts.get(status) || 0) + 1)
  })
} else {
  getEmployeeRecords().forEach((employee) => {
    const department = getDepartmentById(employee.departmentId)?.name || "Unassigned"
    counts.set(department, (counts.get(department) || 0) + 1)
  })

  getAvailableDepartments().forEach((department) => {
    if(!counts.has(department.name)){
      counts.set(department.name, 0)
    }
  })
}

const topDepartments = Array.from(counts.entries())
  .sort((left, right) => right[1] - left[1])
  .slice(0, 6)

if(!topDepartments.length){
  return {
    labels: overviewWorkforceMode === "status" ? ["No Status Data"] : overviewWorkforceMode === "employmentType" ? ["No Payment Type Data"] : ["No Departments"],
    values: [0],
    axisTitle: overviewWorkforceMode === "status" ? "Status" : overviewWorkforceMode === "employmentType" ? "Payment Type" : "Department"
  }
}

return {
  labels: topDepartments.map(([name]) => name),
  values: topDepartments.map(([, count]) => count),
  axisTitle: overviewWorkforceMode === "status" ? "Status" : overviewWorkforceMode === "employmentType" ? "Payment Type" : "Department"
}
}

function renderOverviewCharts(){
const payrollCanvas = document.getElementById("payrollChart")
const workforceCanvas = document.getElementById("workforceChart")

if(!payrollCanvas || !workforceCanvas || typeof Chart === "undefined"){
  return
}

if(overviewWorkforceFilter){
  overviewWorkforceFilter.value = overviewWorkforceMode
}

if(overviewPayrollRange){
  overviewPayrollRange.value = String(overviewPayrollRangeMonths)
}

const payrollSeries = getOverviewPayrollSeries()
const workforceSeries = getOverviewWorkforceSeries()
const currencyCode = getSelectedSystemCurrency()
const currencyFormatter = getCurrencyFormatter(BASE_CURRENCY)

if(!payrollChartInstance){
  payrollChartInstance = new Chart(payrollCanvas, {
    type: "line",
    data: {
      labels: payrollSeries.labels,
      datasets: [{
        label: "Payroll",
        data: payrollSeries.values,
        fill: true,
        borderColor: "#F1724B",
        backgroundColor: "rgba(241, 114, 75, 0.16)",
        pointBackgroundColor: "#F1724B",
        pointBorderColor: "#F1724B",
        tension: 0.28
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Amount"
          },
          ticks: {
            callback(value){
              return Number(value || 0).toLocaleString("en-US")
            }
          }
        },
        x: {
          title: {
            display: true,
            text: "Month"
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label(context){
              return currencyFormatter.format(Number(context.raw || 0))
            }
          }
        }
      }
    }
  })
} else {
  payrollChartInstance.data.labels = payrollSeries.labels
  payrollChartInstance.data.datasets[0].data = payrollSeries.values
}

payrollChartInstance.options.scales.y.title.text = "Amount"
payrollChartInstance.options.scales.y.ticks.callback = function callback(value){
  return Number(value || 0).toLocaleString("en-US")
}
if(payrollChartInstance.options.plugins?.tooltip){
  payrollChartInstance.options.plugins.tooltip.callbacks = {
    label(context){
      return currencyFormatter.format(Number(context.raw || 0))
    }
  }
}

if(!workforceChartInstance){
  workforceChartInstance = new Chart(workforceCanvas, {
    type: "bar",
    data: {
      labels: workforceSeries.labels,
      datasets: [{
        label: "Employees",
        data: workforceSeries.values,
        backgroundColor: "rgba(75, 192, 192, 0.55)",
        borderColor: "rgba(45, 127, 127, 1)",
        borderWidth: 1,
        borderRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Employees"
          },
          ticks: {
            precision: 0
          }
        },
        y: {
          title: {
            display: true,
            text: workforceSeries.axisTitle
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label(context){
              return `Employees: ${Number(context.raw || 0)}`
            }
          }
        }
      }
    }
  })
} else {
  workforceChartInstance.data.labels = workforceSeries.labels
  workforceChartInstance.data.datasets[0].data = workforceSeries.values
  workforceChartInstance.options.scales.y.title.text = workforceSeries.axisTitle
}

updateChartsTheme()
}

function updateChartsTheme(){
const styles = getComputedStyle(document.body)
const textColor = styles.getPropertyValue("--text").trim()
const gridColor = document.body.getAttribute("data-theme") === "dark"
  ? "rgba(255,255,255,0.10)"
  : "rgba(18,61,61,0.10)"

if(payrollChartInstance){
  payrollChartInstance.options.scales.x.ticks.color = textColor
  payrollChartInstance.options.scales.y.ticks.color = textColor
  payrollChartInstance.options.scales.x.title.color = textColor
  payrollChartInstance.options.scales.y.title.color = textColor
  payrollChartInstance.options.scales.x.grid.color = gridColor
  payrollChartInstance.options.scales.y.grid.color = gridColor
  payrollChartInstance.options.scales.x.border.color = gridColor
  payrollChartInstance.options.scales.y.border.color = gridColor
  if(payrollChartInstance.options.plugins?.tooltip){
    payrollChartInstance.options.plugins.tooltip.titleColor = textColor
    payrollChartInstance.options.plugins.tooltip.bodyColor = textColor
  }
  payrollChartInstance.update()
}

if(workforceChartInstance){
  workforceChartInstance.options.scales.x.ticks.color = textColor
  workforceChartInstance.options.scales.y.ticks.color = textColor
  workforceChartInstance.options.scales.x.title.color = textColor
  workforceChartInstance.options.scales.y.title.color = textColor
  workforceChartInstance.options.scales.x.grid.color = gridColor
  workforceChartInstance.options.scales.y.grid.color = gridColor
  workforceChartInstance.options.scales.x.border.color = gridColor
  workforceChartInstance.options.scales.y.border.color = gridColor
  if(workforceChartInstance.options.plugins?.tooltip){
    workforceChartInstance.options.plugins.tooltip.titleColor = textColor
    workforceChartInstance.options.plugins.tooltip.bodyColor = textColor
  }
  workforceChartInstance.update()
}
}

function findTargetedTrigger(selector, attributeName, targetValue, explicitTrigger = null){
  const triggers = Array.from(document.querySelectorAll(selector))
  if(explicitTrigger && explicitTrigger.matches(selector)){
    return explicitTrigger
  }

  return triggers.find((trigger) => trigger.getAttribute(attributeName) === targetValue) || null
}

function syncTargetedNavigation({
  triggerSelector,
  triggerAttribute,
  panelSelector,
  panelActiveClass,
  activePanelId,
  explicitTrigger = null
}){
  document.querySelectorAll(triggerSelector).forEach((trigger) => trigger.classList.remove("active"))
  findTargetedTrigger(triggerSelector, triggerAttribute, activePanelId, explicitTrigger)?.classList.add("active")
  document.querySelectorAll(panelSelector).forEach((panel) => {
    panel.classList.toggle(panelActiveClass, panel.id === activePanelId)
  })
}

function bindTargetedNavigation(selector, attributeName, handler){
  document.querySelectorAll(selector).forEach((trigger) => {
    trigger.addEventListener("click", (navigationEvent) => {
      navigationEvent.preventDefault()
      const targetId = trigger.getAttribute(attributeName)
      if(targetId){
        handler(targetId, trigger)
      }
    })
  })
}

function getActiveWorkforceTabId(){
  return document.querySelector("[data-workforce-tab-target].active")?.getAttribute("data-workforce-tab-target") || "employees"
}

function syncEmployeeActionButtons(){
  if(!editEmployeeBtn){
    return
  }

  const hasSelectedEmployee = Boolean(getSelectedEmployee())
  editEmployeeBtn.disabled = !hasSelectedEmployee
  editEmployeeBtn.classList.toggle("btn-disabled", !hasSelectedEmployee)
  editEmployeeBtn.classList.toggle("btn-primary", hasSelectedEmployee)
}
  

  
function showSection(sectionId, trigger = null) {

    const targetSection = document.getElementById(sectionId)
    if(!targetSection){
      return
    }

    document.querySelectorAll(".section").forEach(section => {
      section.classList.remove("section-access-locked");
    });

      syncTargetedNavigation({
        triggerSelector: "[data-section-target]",
        triggerAttribute: "data-section-target",
        panelSelector: ".section",
        panelActiveClass: "active-section",
        activePanelId: sectionId,
        explicitTrigger: trigger
      });

      const requiresAdmin = sectionId === "financials" || sectionId === "insights"
      if(requiresAdmin && !userHasRoleAccess(appState, ["Admin"])){
        setSectionAccessMessage(sectionId, "This section can only be accessed by admin.")
        forceContentReset(sectionId);
        return
      }

      setSectionAccessMessage(sectionId, "")

      if(sectionId === "payroll"){
        renderPayrollSection()
      }

      if(sectionId === "workforce"){
        renderWorkforceSection()
      }

      if(sectionId === "worktrack"){
        renderWorktrackSection()
      }

      if(sectionId === "insights"){
        renderInsightsSection()
      }

      if(sectionId === "financials"){
        renderFinancialsSection()
      }

      forceContentReset(sectionId);
    }

function setSectionAccessMessage(sectionId, message){
  const section = document.getElementById(sectionId)
  if(!section){
    return
  }

  let messageBox = section.querySelector(".section-access-message")
  if(!messageBox){
    messageBox = document.createElement("div")
    messageBox.className = "section-access-message"
    section.prepend(messageBox)
  }

  if(message){
    section.classList.add("section-access-locked")
    messageBox.textContent = message
    messageBox.hidden = false
    return
  }

  section.classList.remove("section-access-locked")
  messageBox.textContent = ""
  messageBox.hidden = true
}
  
  function openTab(tabId, trigger = null){
    syncTargetedNavigation({
      triggerSelector: "[data-workforce-tab-target]",
      triggerAttribute: "data-workforce-tab-target",
      panelSelector: ".tab-content",
      panelActiveClass: "active-tab",
      activePanelId: tabId,
      explicitTrigger: trigger
    });

    if(tabId === "employees"){
      renderEmployeeTable()
    } else if(tabId === "departments"){
      renderDepartmentCards(departmentSearch?.value || "")
    } else if(tabId === "contracts"){
      renderContracts()
    }

    scrollContentToTop(tabId);
    
    }


    function selectEmployee(employeeSource){
        const employee = resolveEmployeeEntity(employeeSource)
        if(!employee) return

        selectedRow = null;
        appState.employees.selectedEmployeeId = employee.id
        renderEmployeeTable()
        renderPayrollStructure()
        syncEmployeeActionButtons()
        
        }
        

        let currentPage = 1;
const rowsPerPage = 20;

function showPage(page){
currentPage = page;
renderEmployeeTable();

}

function nextPage(){
const maxPage = Math.max(1, Math.ceil(getEmployeeRecords().length / rowsPerPage));

if(currentPage < maxPage){
currentPage++;
showPage(currentPage);
}
}

function prevPage(){
if(currentPage > 1){
currentPage--;
showPage(currentPage);
}
}

document.addEventListener("DOMContentLoaded", ()=>{
  showPage(1);
  initializePasswordVisibilityToggles()
  renderCurrencyOptions()
renderSelectedDocumentPreview(empDocumentsPreview, selectedEmployeeDocuments)
renderSelectedDocumentPreview(contractDocumentsPreview, selectedContractDocuments)
  renderCompanyDropdown()
  renderCompanySettings()
  renderMembers()
  renderActivityHistory()
  renderProfileState()
applyTheme()
updateDashboardMetrics()
renderWorkforceSection()
  renderPayrollSection()
  renderInsightsSection()
  renderFinancialsSection()
  fetchLatestExchangeRates()
  ensureLiveBackendSyncLoop()
  void restorePersistedLiveBackendSession()
  document.addEventListener("visibilitychange", () => {
    if(document.visibilityState === "visible"){
      void performLiveBackendSync({ force: true })
    }
  })
  bindTargetedNavigation("[data-section-target]", "data-section-target", showSection)
  bindTargetedNavigation("[data-workforce-tab-target]", "data-workforce-tab-target", openTab)
  bindTargetedNavigation("[data-payroll-tab-target]", "data-payroll-tab-target", openPayrollTab)
  bindTargetedNavigation("[data-worktrack-tab-target]", "data-worktrack-tab-target", openWorktrackTab)
  bindTargetedNavigation("[data-financials-tab-target]", "data-financials-tab-target", openFinancialsTab)
  bindTargetedNavigation("[data-insights-tab-target]", "data-insights-tab-target", openInsightsTab)
  if(employeeSaveButton){
    employeeSaveButton.addEventListener("click", saveEmployee)
  }
});

let selectedRow = null;

const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const editEmployeeBtn = document.getElementById("editEmployee");

function getEmployeeStatusClass(status){
  const normalizedStatus = String(status || "").toUpperCase()
  const statusClassMap = {
    ACTIVE: "active",
    FIRED: "fired",
    RESIGNED: "resigned",
    RETIRED: "retired",
    LEAVE: "leave"
  }

  return statusClassMap[normalizedStatus] || "active"
}

function renderEmployeeTable(){
  if(!employeeTableBody) return

  const employeeRecords = getFilteredEmployees()
  if(appState.employees.selectedEmployeeId && !employeeRecords.some((employee) => employee.id === appState.employees.selectedEmployeeId)){
    appState.employees.selectedEmployeeId = null
  }
  const maxPage = Math.max(1, Math.ceil(employeeRecords.length / rowsPerPage))
  if(currentPage > maxPage){
    currentPage = maxPage
  }

  const start = (currentPage - 1) * rowsPerPage
  const pagedEmployees = employeeRecords.slice(start, start + rowsPerPage)
  employeeTableBody.innerHTML = ""

  if(!pagedEmployees.length){
    employeeTableBody.innerHTML = `<tr><td colspan="5">No employees match the current search or filters.</td></tr>`
    document.getElementById("pageNumber").textContent = "1"
    syncEmployeeActionButtons()
    return
  }

  pagedEmployees.forEach((employee) => {
    const departmentName = getDepartmentById(employee.departmentId)?.name || "Unassigned"
    const row = document.createElement("tr")
    row.className = appState.employees.selectedEmployeeId === employee.id ? "selected" : ""
    row.innerHTML = `
      <td>${employee.fullName}</td>
      <td>${departmentName}</td>
      <td>${formatEmployeePaymentTypeDisplay(employee)}</td>
      <td>${formatUiDate(employee.employmentDate)}</td>
      <td><span class="status ${getEmployeeStatusClass(employee.status)}">${employee.status}</span></td>
    `
    row.addEventListener("click", () => selectEmployee(employee.id))
    employeeTableBody.appendChild(row)
  })

  document.getElementById("pageNumber").textContent = String(currentPage)
  syncEmployeeActionButtons()
}

function renderWorkforceSection(){
  syncTargetedNavigation({
    triggerSelector: "[data-workforce-tab-target]",
    triggerAttribute: "data-workforce-tab-target",
    panelSelector: ".tab-content",
    panelActiveClass: "active-tab",
    activePanelId: getActiveWorkforceTabId()
  })
  renderEmployeeFilterDepartmentOptions()
  renderEmployeeTable()
  renderEmployeeDepartmentOptions(empDept?.value || "")
  renderDepartmentCards(departmentSearch?.value || "")
  renderContracts()
}

function openEmployeeModal(){
    if(!employeeModal) return

  openTab("employees")
  closeAllOverlayWindows()

  selectedRow = null
  appState.employees.selectedEmployeeId = null
  selectedEmployeeAvatar = ""
  selectedEmployeeDocuments = []
  if(employeeModalTitle){
    employeeModalTitle.textContent = "Add Employee"
  }
  if(employeeSaveButton){
    employeeSaveButton.textContent = "Add"
  }
  if(empName){
    empName.value = ""
  }
  if(empIdentification){
    empIdentification.value = ""
  }
  if(empAccountNumber){
    empAccountNumber.value = ""
  }
    if(empAccountDetails){
      empAccountDetails.value = ""
    }
    if(empDept){
      renderEmployeeDepartmentOptions()
      empDept.value = ""
    }
    if(empRole){
      empRole.value = ""
  }
  if(empDate){
    empDate.value = ""
  }
  if(empType){
    empType.value = "Monthly"
  }
  if(empPaymentBasis){
    empPaymentBasis.value = "standard"
  }
  syncEmployeePaymentBasisControl(empPaymentBasisRow, empPaymentBasis, empType?.value || "Monthly", "standard")
  if(empSalary){
    empSalary.value = "180000"
  }
  if(empStatus){
    empStatus.value = "ACTIVE"
  }
  if(empProfileImage){
    empProfileImage.value = ""
  }
  if(empDocuments){
    empDocuments.value = ""
  }
    resetEmployeeFinanceInputs()
    setAvatarPreview(employeeAvatarPreview, "", "fa-solid fa-circle-user")
    renderSelectedDocumentPreview(empDocumentsPreview, selectedEmployeeDocuments)
    setOverlayOpenState(employeeModal, true)
    syncEmployeeActionButtons()
    window.setTimeout(() => {
      empName?.focus()
    }, 0)
  }

function openEmployeeProfileModal(){
    if(!getSelectedEmployee() || !employeeProfileWindow) return
    openTab("employees")
    closeAllOverlayWindows()
    selectedProfileEmployeeAvatar = ""
    if(profileEmpProfileImage){
      profileEmpProfileImage.value = ""
    }
    renderEmployeeProfile(getSelectedEmployee())
    setOverlayOpenState(employeeProfileWindow, true)
    window.setTimeout(() => {
      profileEmpName?.focus()
    }, 0)
  }

window.openEmployeeModal = openEmployeeModal
window.openEmployeeProfileModal = openEmployeeProfileModal

if(addEmployeeBtn && employeeModal){
addEmployeeBtn.onclick = openEmployeeModal;
}

if(editEmployeeBtn){
editEmployeeBtn.onclick = openEmployeeProfileModal;
}

function closeModal(){
    setOverlayOpenState(employeeModal, false)
  }

function closeProfileModal(){
    selectedProfileEmployeeAvatar = ""
    if(profileEmpProfileImage){
      profileEmpProfileImage.value = ""
    }
    setOverlayOpenState(employeeProfileWindow, false)
  }

window.closeModal = closeModal
window.closeProfileModal = closeProfileModal

async function saveEmployee(){
    if(!(empName && empDept && empType && empDate && empStatus && empSalary)) return;

    const name = empName.value.trim();
    const departmentId = String(empDept.value || "").trim();
    const type = empType.value;
    const paymentBasis = normalizeEmployeePaymentBasisValue(type, empPaymentBasis?.value || "standard")
    const date = empDate.value;
    const status = empStatus.value;
    const salary = Number(empSalary.value || estimateSalaryByPaymentType(type));
    if(!name || !departmentId || !date){
      window.alert("Employee name, department, and employment date are required.")
      return;
    }
    const financialProfile = collectEmployeeFinancialProfileFromAddForm()

    const activeCompany = getActiveCompany()
    const department = getDepartmentById(departmentId)
    if(!department){
      window.alert("Select a valid department before saving the employee.")
      return
    }
    const roleTitle = empRole.value.trim() || `${department.name} Officer`
    const employeeRecord = createEmployeeModel({
      id: createStateEntityId("emp"),
      companyId: activeCompany?.id || "company-a",
      departmentId: department?.id || "",
      fullName: name,
      identificationNumber: empIdentification.value.trim() || `ID-${Math.floor(100000 + Math.random() * 899999)}`,
      accountNumber: empAccountNumber.value.trim() || "",
      accountDetails: empAccountDetails.value.trim() || "",
      roleTitle,
      employmentType: type,
      paymentType: type,
      paymentBasis,
      employmentDate: date,
      salaryAmount: salary,
    status,
    payrollStatus: status.toUpperCase() === "ACTIVE" ? "pending" : "hold",
    profileImage: selectedEmployeeAvatar,
    documents: [...selectedEmployeeDocuments],
    financialProfile
  })

  setActionButtonBusy(employeeSaveButton, true, "Saving...")
    try{
      const createdEmployee = await window.HexaPayApi.createEmployee(employeeRecord)
      markPayrollRunStale()
      syncDepartmentRoleSummary(department.id, createdEmployee.roleTitle || roleTitle)
      appState.employees.selectedEmployeeId = createdEmployee.id
      renderWorkforceSection()
      updateDashboardMetrics()
      addActivity("Employee added", `${name} was added to ${department.name}.`)
      closeModal()
      } catch (error){
        console.error("Failed to create employee", error)
      const validationMessage = error?.payload?.error?.details?.[0]?.message
      window.alert(validationMessage || error?.payload?.error?.message || error?.message || "Employee could not be created right now.")
    } finally {
      setActionButtonBusy(employeeSaveButton, false)
    }
  }

window.saveEmployee = saveEmployee

async function updateEmployeeStatus(status){
  const employee = getSelectedEmployee()
  if(!employee) return

  try{
      const updatedEmployee = await window.HexaPayApi.updateEmployee(employee.id, {
        status,
        payrollStatus: status === "ACTIVE" ? "pending" : "hold"
      })
      markPayrollRunStale()
      await window.HexaPayApi.getEmployees()
      renderWorkforceSection()
      renderLeaveManagementTab()
      updateDashboardMetrics()
      renderEmployeeProfile(updatedEmployee)
      addActivity("Employee status updated", `${updatedEmployee.fullName} marked as ${status}.`)
  } catch (error){
    console.error("Failed to update employee status", error)
    window.alert(error?.payload?.error?.message || error?.message || "Employee status could not be updated right now.")
  }
}

window.updateEmployeeStatus = updateEmployeeStatus

async function saveEmployeeProfileDetails(){
  const employee = getSelectedEmployee()
  if(!employee){
    return
  }

  const nextDepartmentId = String(profileEmpDept?.value || "").trim()
  const nextDepartment = getDepartmentById(nextDepartmentId)
  const nextName = profileEmpName?.value.trim() || ""
  const nextRole = profileEmpRole?.value.trim() || ""
  const nextDate = profileEmpDate?.value || ""
  const nextPaymentType = profileEmpType?.value || employee.paymentType || employee.employmentType || "Monthly"
  const nextPaymentBasis = normalizeEmployeePaymentBasisValue(nextPaymentType, profileEmpPaymentBasis?.value || employee.paymentBasis || "standard")
  const nextSalaryAmount = getProfileSalaryAmount(employee.salaryAmount || 0)

  if(!nextName || !nextDepartmentId || !nextDate){
    window.alert("Name, department, and employment date are required.")
    return
  }
  if(!nextDepartment){
    window.alert("Select a valid department before saving employee details.")
    return
  }
  if(nextSalaryAmount === null){
    window.alert("Enter a valid salary amount before saving employee details.")
    return
  }

  setActionButtonBusy(saveEmployeeProfileButton, true, "Saving...")
  try{
    const updatedEmployee = await window.HexaPayApi.updateEmployee(employee.id, {
      fullName: nextName,
      identificationNumber: profileEmpIdentification?.value.trim() || "",
      accountNumber: profileEmpAccountNumber?.value.trim() || "",
      accountDetails: profileEmpAccountDetails?.value.trim() || "",
      departmentId: nextDepartmentId,
      roleTitle: nextRole,
      employmentDate: nextDate,
      paymentType: nextPaymentType,
      paymentBasis: nextPaymentBasis,
      salaryAmount: nextSalaryAmount,
      profileImage: selectedProfileEmployeeAvatar || buildEmployeeMeta(employee).profileImage || ""
    })
    markPayrollRunStale()
    await window.HexaPayApi.getEmployees()
    selectedProfileEmployeeAvatar = ""
    if(profileEmpProfileImage){
      profileEmpProfileImage.value = ""
    }
    renderWorkforceSection()
    renderFinancialsSection()
    await renderPayrollSection()
    updateDashboardMetrics()
    renderEmployeeProfile(updatedEmployee)
    addActivity("Employee profile updated", `${updatedEmployee.fullName}'s profile details were updated.`)
  } catch (error){
    console.error("Failed to update employee profile details", error)
    window.alert(
      error?.payload?.errors?.[0]?.message ||
      error?.payload?.message ||
      error?.payload?.error?.message ||
      error?.message ||
      "Employee profile could not be updated."
    )
  } finally {
    setActionButtonBusy(saveEmployeeProfileButton, false)
  }
}

async function saveEmployeeFinancialAdjustments(){
  const employee = getSelectedEmployee()
  if(!employee) return

  const nextSalaryAmount = Number(profileSalaryEditor?.value || employee.salaryAmount || 0)
  const nextFinancialProfile = collectEmployeeFinancialProfileFromProfile()

  setActionButtonBusy(saveEmployeeFinancialButton, true, "Saving...")
  try{
    const updatedEmployee = await window.HexaPayApi.updateEmployee(employee.id, {
      salaryAmount: nextSalaryAmount,
      financialProfile: nextFinancialProfile
    })
    markPayrollRunStale()
    await window.HexaPayApi.getEmployees()
    renderEmployeeTable()
    updateDashboardMetrics()
    renderEmployeeProfile(updatedEmployee)
    renderFinancialsSection()
    addActivity("Employee salary rules updated", `${updatedEmployee.fullName}'s tax and loan settings were updated.`)
  } catch (error){
    console.error("Failed to update employee salary rules", error)
    window.alert(
      error?.payload?.errors?.[0]?.message ||
      error?.payload?.message ||
      error?.payload?.error?.message ||
      error?.message ||
      "Employee salary rules could not be updated."
    )
  } finally {
    setActionButtonBusy(saveEmployeeFinancialButton, false)
  }
}

if(addDepartmentBtn){
addDepartmentBtn.addEventListener("click", () => openDepartmentModal(false))
}

;[employeeSearchInput, employeeDepartmentFilter, employeeEmploymentTypeFilter, employeeStatusFilter, employeeSortFilter]
  .filter(Boolean)
  .forEach((element) => {
    const rerenderEmployees = () => {
      currentPage = 1
      renderEmployeeTable()
    }
    element.addEventListener("input", rerenderEmployees)
    element.addEventListener("change", rerenderEmployees)
  })
  
if(editDepartmentBtn){
  editDepartmentBtn.addEventListener("click", () => {
  const availableDepartments = getAvailableDepartments()
  if(!selectedDepartmentId && availableDepartments.length){
    selectedDepartmentId = availableDepartments[0].id
    }
  openDepartmentModal(true)
  closeDepartmentProfile()
})
}

if(departmentSearch){
departmentSearch.addEventListener("input", () => {
  renderDepartmentCards(departmentSearch.value)
})
}

if(departmentSaveButton){
departmentSaveButton.addEventListener("click", async () => {
    const name = departmentNameInput.value.trim().toUpperCase()
  const notes = departmentNotesInput.value.trim()

  if(!name){
    return
  }

      if(isEditingDepartment){
        const department = getDepartmentById(selectedDepartmentId)
        if(!department) return

      setActionButtonBusy(departmentSaveButton, true, "Saving...")
      try{
        const updatedDepartment = window.HexaPayApi?.updateDepartment
          ? await window.HexaPayApi.updateDepartment(department.id, {
              name,
              notes,
              icon: selectedDepartmentIcon
            })
          : Object.assign(department, {
              name,
              notes,
              icon: selectedDepartmentIcon
            })

        selectedDepartmentId = updatedDepartment.id
        addActivity("Department updated", `${name} department details were updated.`)
      } catch (error){
        console.error("Failed to update department", error)
        window.alert(error?.payload?.error?.details?.[0]?.message || error?.payload?.error?.message || error?.message || "Department could not be updated right now.")
        return
      } finally {
        setActionButtonBusy(departmentSaveButton, false)
      }
    } else {
      setActionButtonBusy(departmentSaveButton, true, "Saving...")
      try{
        const department = window.HexaPayApi?.createDepartment
            ? await window.HexaPayApi.createDepartment({
              id: createStateEntityId("dept"),
              companyId: getActiveCompany()?.id || "company-a",
              name,
              notes,
              icon: selectedDepartmentIcon
            })
          : createDepartmentModel({
              id: createStateEntityId("dept"),
              companyId: getActiveCompany()?.id || "company-a",
              name,
              employeeCount: 0,
              notes,
              icon: selectedDepartmentIcon
            })

        if(!window.HexaPayApi?.createDepartment){
          appSettings.departments.push(department)
        }
        selectedDepartmentId = department.id
        addActivity("Department added", `${name} was added to the company.`)
      } catch (error){
        console.error("Failed to create department", error)
        window.alert(error?.payload?.error?.details?.[0]?.message || error?.payload?.error?.message || error?.message || "Department could not be created right now.")
        return
      } finally {
        setActionButtonBusy(departmentSaveButton, false)
      }
    }

    persistSettings()
    renderEmployeeDepartmentOptions()
    renderDepartmentCards(departmentSearch?.value || "")
    closeDepartmentModal()
  })
}

if(empProfileImage){
empProfileImage.addEventListener("change", () => {
  const file = empProfileImage.files?.[0]
  if(!file){
    selectedEmployeeAvatar = ""
    setAvatarPreview(employeeAvatarPreview, "", "fa-solid fa-circle-user")
    return
  }

  const reader = new FileReader()
  reader.addEventListener("load", () => {
    selectedEmployeeAvatar = typeof reader.result === "string" ? reader.result : ""
    setAvatarPreview(employeeAvatarPreview, selectedEmployeeAvatar, "fa-solid fa-circle-user")
  })
  reader.readAsDataURL(file)
})
}

if(profileEmpProfileImage){
profileEmpProfileImage.addEventListener("change", async () => {
  const file = profileEmpProfileImage.files?.[0]
  if(!file){
    selectedProfileEmployeeAvatar = ""
    renderEmployeeProfile(getSelectedEmployee())
    return
  }

  try{
    selectedProfileEmployeeAvatar = await readImageFileAsDataUrl(file)
    renderEmployeeProfile(getSelectedEmployee())
  } catch (error){
    console.error("Failed to load selected employee profile photo.", error)
    selectedProfileEmployeeAvatar = ""
    window.alert("The selected profile photo could not be loaded.")
    renderEmployeeProfile(getSelectedEmployee())
  }
})
}

if(empDocuments){
empDocuments.addEventListener("change", () => {
  selectedEmployeeDocuments = appendSelectedDocumentNames(selectedEmployeeDocuments, empDocuments)
  renderSelectedDocumentPreview(empDocumentsPreview, selectedEmployeeDocuments)
  empDocuments.value = ""
})
}

if(empType){
empType.addEventListener("change", () => {
  syncEmployeePaymentBasisControl(empPaymentBasisRow, empPaymentBasis, empType.value, empPaymentBasis?.value || "standard")
  if(empSalary && !Number(empSalary.value || 0)){
    empSalary.value = String(estimateSalaryByPaymentType(empType.value))
  }
})
}

if(profileEmpType){
profileEmpType.addEventListener("change", () => {
  const employee = getSelectedEmployee()
  syncEmployeePaymentBasisControl(
    profileEmpPaymentBasisRow,
    profileEmpPaymentBasis,
    profileEmpType.value,
    profileEmpPaymentBasis?.value || employee?.paymentBasis || "standard"
  )
})
}

if(contractDocumentsInput){
contractDocumentsInput.addEventListener("change", () => {
  selectedContractDocuments = appendSelectedDocumentNames(selectedContractDocuments, contractDocumentsInput)
  renderSelectedDocumentPreview(contractDocumentsPreview, selectedContractDocuments)
  contractDocumentsInput.value = ""
})
}

if(empApplyTaxButton){
empApplyTaxButton.addEventListener("click", () => {
  const nextState = empApplyTaxButton.dataset.active !== "true"
  setTaxFinancialButtonState(empApplyTaxButton, nextState)
  setTaxFinancialVisibility(empTaxOptions, nextState)
})
}

if(empLoanEnabled){
empLoanEnabled.addEventListener("change", () => {
  setLoanFieldsVisibility(empLoanFields, empLoanEnabled.checked)
})
}

if(profileApplyTaxButton){
profileApplyTaxButton.addEventListener("click", () => {
  const nextState = profileApplyTaxButton.dataset.active !== "true"
  setTaxFinancialButtonState(profileApplyTaxButton, nextState)
  setTaxFinancialVisibility(profileTaxOptions, nextState)
})
}

if(profileLoanEnabled){
profileLoanEnabled.addEventListener("change", () => {
  setLoanFieldsVisibility(profileLoanFields, profileLoanEnabled.checked)
})
}

if(saveEmployeeFinancialButton){
saveEmployeeFinancialButton.addEventListener("click", saveEmployeeFinancialAdjustments)
}

if(saveEmployeeProfileButton){
saveEmployeeProfileButton.addEventListener("click", saveEmployeeProfileDetails)
}

if(profileEmpSalary){
profileEmpSalary.addEventListener("input", () => syncProfileSalaryInputs(profileEmpSalary.value))
}

if(profileSalaryEditor){
profileSalaryEditor.addEventListener("input", () => syncProfileSalaryInputs(profileSalaryEditor.value))
}

if(companyLogoInput){
companyLogoInput.addEventListener("change", async () => {
  const file = companyLogoInput.files?.[0]
  if(!file){
    selectedCompanyLogo = ""
    setAvatarPreview(companyLogoPreview, appSettings.company.logoUrl || "", "fa-solid fa-building")
    return
  }

  try{
    selectedCompanyLogo = await readImageFileAsDataUrl(file)
    setAvatarPreview(companyLogoPreview, selectedCompanyLogo, "fa-solid fa-building")
  } catch (error){
    console.error("Failed to load company logo file.", error)
    selectedCompanyLogo = ""
    setProfileAuthMessage("Could not load the selected company logo file.", "error")
    renderProfileState()
  }
})
}

if(profileSignupLogo){
profileSignupLogo.addEventListener("change", async () => {
  const file = profileSignupLogo.files?.[0]
  if(!file){
    selectedSignupCompanyLogo = ""
    setAvatarPreview(profileSignupLogoPreview, appSettings.company.logoUrl || "", "fa-solid fa-building")
    return
  }

  try{
    selectedSignupCompanyLogo = await readImageFileAsDataUrl(file)
    setAvatarPreview(profileSignupLogoPreview, selectedSignupCompanyLogo, "fa-solid fa-building")
  } catch (error){
    console.error("Failed to load signup company logo file.", error)
    selectedSignupCompanyLogo = ""
    setProfileAuthMessage("Could not load the selected signup logo file.", "error")
    renderProfileState()
  }
})
}

if(departmentIconLibrary){
departmentIconLibrary.addEventListener("click", (event) => {
  const button = event.target.closest("[data-department-icon]")
  if(!button) return

  selectedDepartmentIcon = button.dataset.departmentIcon || "fa-building"
  renderDepartmentAvatarPreview()
  renderDepartmentIconLibrary()
})
}

if(departmentDeleteButton){
departmentDeleteButton.addEventListener("click", () => {
  if(isEditingDepartment){
    openDepartmentDeleteConfirm()
  }
})
}

if(cancelDepartmentDeleteButton){
cancelDepartmentDeleteButton.addEventListener("click", closeDepartmentDeleteConfirm)
}

  if(confirmDepartmentDeleteButton){
   confirmDepartmentDeleteButton.addEventListener("click", async () => {
    const department = getDepartmentById(selectedDepartmentId)
      if(!department) return

      setActionButtonBusy(confirmDepartmentDeleteButton, true, "Deleting...")
      try{
        if(window.HexaPayApi?.deleteDepartment){
          await window.HexaPayApi.deleteDepartment(department.id)
        } else {
          appSettings.departments = appSettings.departments.filter((item) => item.id !== selectedDepartmentId)
        }
      selectedDepartmentId = getAvailableDepartments()[0]?.id || null
        persistSettings()
        renderEmployeeDepartmentOptions()
        renderDepartmentCards(departmentSearch?.value || "")
      closeDepartmentDeleteConfirm()
      closeDepartmentModal()
      closeDepartmentProfile()
      addActivity("Department deleted", `${department.name} was deleted from the company.`)
    } catch (error){
      console.error("Failed to delete department", error)
      window.alert(error?.payload?.error?.message || error?.message || "Department could not be deleted right now.")
    } finally {
      setActionButtonBusy(confirmDepartmentDeleteButton, false)
    }
  })
}

if(assignHodButton){
 assignHodButton.addEventListener("click", async () => {
  const department = getDepartmentById(selectedDepartmentId)
      const employee = getSelectedEmployee()
      if(!department || !employee) return

    try{
      if(window.HexaPayApi?.updateDepartment){
        await window.HexaPayApi.updateDepartment(department.id, {
          hodEmployeeId: employee.id,
          hod: employee.fullName
        })
      } else {
        department.headOfDepartmentEmployeeId = employee.id
        department.hod = employee.fullName
      }
      persistSettings()
      openDepartmentProfile()
      renderDepartmentCards(departmentSearch?.value || "")
      addActivity("HOD assigned", `${employee.fullName} is now heading ${department.name}.`)
    } catch (error){
      console.error("Failed to assign head of department", error)
      window.alert(error?.payload?.error?.message || error?.message || "Head of department could not be assigned right now.")
    }
  })
}

if(addDepartmentMemberButton){
addDepartmentMemberButton.addEventListener("click", async () => {
  const department = getDepartmentById(selectedDepartmentId)
    const employee = getSelectedEmployee()
    if(!department || !employee) return

  try{
    const updatedEmployee = await window.HexaPayApi.updateEmployee(employee.id, {
      departmentId: department.id
    })
    renderEmployeeTable()
    updateDashboardMetrics()
    renderDepartmentCards(departmentSearch?.value || "")
    openDepartmentProfile()
    addActivity("Department member added", `${updatedEmployee.fullName} joined ${department.name}.`)
  } catch (error){
    console.error("Failed to update employee department", error)
  }
})
}

if(addContractBtn){
addContractBtn.addEventListener("click", () => openContractModal(false))
}

if(editContractBtn){
  editContractBtn.disabled = true
  editContractBtn.classList.add("btn-disabled")
editContractBtn.addEventListener("click", () => {
  if(!selectedContractId && getContractRecords().length){
    selectedContractId = getContractRecords()[0].id
    appState.contracts.selectedContractId = selectedContractId
  }
  openContractModal(true)
})
}

if(deleteContractBtn){
deleteContractBtn.disabled = true
deleteContractBtn.classList.add("btn-disabled")
deleteContractBtn.addEventListener("click", async () => {
  const contract = getContractById(selectedContractId)
  if(!contract){
    return
  }

  if(!window.confirm(`Delete ${contract.partyName}'s contract? This cannot be undone.`)){
    return
  }

  try{
    setActionButtonBusy(deleteContractBtn, true, "Deleting...")
    await window.HexaPayApi.deleteContract(contract.id)
    selectedContractId = getVisibleContractRecords()[0]?.id || null
    appState.contracts.selectedContractId = selectedContractId
    closeContractModal()
    closeContractProfile()
    renderContracts()
    addActivity("Contract deleted", `${contract.partyName} contract was deleted.`)
  } catch (error){
    console.error("Failed to delete contract.", error)
    window.alert(error?.payload?.error?.message || error?.message || "Contract could not be deleted.")
  } finally {
    setActionButtonBusy(deleteContractBtn, false)
    renderContractActionButtons()
  }
})
}

;[contractSearchInput, contractTypeFilter, contractStartFilter, contractStatusFilter, contractSortFilter]
  .filter(Boolean)
  .forEach((element) => {
    element.addEventListener("input", renderContracts)
    element.addEventListener("change", renderContracts)
  })

if(contractSaveButton){
contractSaveButton.addEventListener("click", async () => {
  const activeCompany = getActiveCompany()
  const contractRecord = createContractModel({
    id: isEditingContract && selectedContractId ? selectedContractId : createStateEntityId("contract"),
    companyId: activeCompany?.id || "company-a",
    partyName: contractNameInput.value.trim(),
    companyName: contractCompanyInput.value.trim() || appSettings.company.name,
    contractNumber: contractNumberInput.value.trim(),
    accountNumber: contractAccountNumberInput.value.trim(),
    accountDetails: contractAccountDetailsInput.value.trim(),
    roleTitle: contractRoleInput.value.trim(),
    contractDate: contractDateInput.value,
    contractType: contractTypeInput.value,
    totalPayment: Number(contractPaymentInput.value || 0),
    status: isEditingContract && selectedContractId
      ? (getContractById(selectedContractId)?.status || "Active")
      : "Active",
    balance: Number(contractPaymentInput.value || 0),
    documents: [...selectedContractDocuments],
    paymentHistory: []
  })

  if(!contractRecord.partyName || !contractRecord.contractDate){
    return
  }

  try{
    setActionButtonBusy(contractSaveButton, true, "Saving...")

    const savedContract = isEditingContract && selectedContractId
      ? await window.HexaPayApi.updateContract(selectedContractId, contractRecord)
      : await window.HexaPayApi.createContract(contractRecord)

    if(savedContract?.id){
      selectedContractId = savedContract.id
      appState.contracts.selectedContractId = savedContract.id
    }

    renderContracts()
    closeContractModal()
    addActivity(
      isEditingContract ? "Contract updated" : "Contract added",
      isEditingContract
        ? `${contractRecord.partyName} contract details were updated.`
        : `${contractRecord.partyName} contract was created.`
    )
  } catch (error){
    console.error("Failed to save contract.", error)
    window.alert(error?.payload?.error?.message || error?.message || "Contract could not be saved.")
  } finally {
    setActionButtonBusy(contractSaveButton, false)
  }
})
}

if(payrollSalaryType){
payrollSalaryType.addEventListener("change", () => {
  appSettings.payroll.salaryType = payrollSalaryType.value
  appSettings.payroll.department = ""
  preparePayrollSelectionChange()
  resetPayrollApprovals()
  persistSettings()
  renderPayrollSection()
})
}

if(payrollDueSelect){
payrollDueSelect.addEventListener("change", () => {
  appSettings.payroll.due = payrollDueSelect.value
  preparePayrollSelectionChange()
  resetPayrollApprovals()
  persistSettings()
  renderPayrollSection()
})
}

if(payrollDepartmentFilter){
payrollDepartmentFilter.addEventListener("change", () => {
  appSettings.payroll.department = payrollDepartmentFilter.value
  preparePayrollSelectionChange()
  persistSettings()
  renderPayrollSection()
})
}

if(payrollTablesArea){
payrollTablesArea.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-payroll-pay-action]")
  if(!button){
    return
  }

  const itemId = String(button.dataset.payrollItemId || "").trim()
  const runId = String(appSettings.payroll.currentRunId || "").trim()
  if(!itemId || !runId){
    return
  }

  try{
    setActionButtonBusy(button, true, "Confirming...")
    const result = await window.HexaPayApi.markPayrollItemPaid(runId, itemId, true)
    const employee = result?.item ? getEmployeeById(result.item.employeeId) : null
    const payrollCompleted = Number(result?.run?.itemCount || 0) > 0 && Number(result?.run?.unpaidItemCount || 0) === 0
    const nextPayrollSelection = payrollCompleted ? advanceToNextPayrollDue(result.run) : null
    if(nextPayrollSelection){
      await renderPayrollSection()
      const completedLabel = formatPayrollPeriodLabel(result.run.period, result.run.salaryType)
      addActivity("Payroll paid", `${employee?.fullName || "Employee"} completed ${completedLabel} payroll. HexaPay moved to ${nextPayrollSelection.label}.`)
      showNotificationPopup("Payroll Complete", `${completedLabel} payroll is fully paid. Now showing ${nextPayrollSelection.label}.`)
      return
    }

    await renderPayrollRun(await window.HexaPayApi.getPayrollRun(runId))
    await renderPayrollHistory()
    addActivity("Payroll paid", `${employee?.fullName || "Employee"} was marked as paid for this payroll run.`)
  } catch (error){
    console.error("Failed to confirm payroll payment", error)
    window.alert(error?.payload?.error?.message || error?.message || "Payroll payment could not be confirmed right now.")
  } finally {
    setActionButtonBusy(button, false)
  }
})
}

document.querySelectorAll("[data-payroll-history-view]").forEach((button) => {
button.addEventListener("click", async () => {
  const nextView = String(button.dataset.payrollHistoryView || "daily").trim().toLowerCase()
  if(!nextView || appSettings.payroll.historyView === nextView){
    return
  }

  appSettings.payroll.historyView = nextView
  appSettings.payroll.historyRunId = ""
  persistSettings()
  await renderPayrollHistory()
})
})

if(payrollHistorySelect){
payrollHistorySelect.addEventListener("change", async () => {
  appSettings.payroll.historyRunId = payrollHistorySelect.value
  persistSettings()
  await renderPayrollHistory()
})
}

if(payrollHistoryArea){
payrollHistoryArea.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-payroll-history-run-id]")
  if(!button){
    return
  }

  const runId = String(button.dataset.payrollHistoryRunId || "").trim()
  if(!runId){
    return
  }

  try{
    setActionButtonBusy(button, true, "Opening...")
    const payload = await window.HexaPayApi.getPayrollRun(runId)
    appSettings.payroll.currentRunId = payload.run.id
    appSettings.payroll.salaryType = payload.run.salaryType || appSettings.payroll.salaryType
    appSettings.payroll.due = payload.run.period || appSettings.payroll.due
    appSettings.payroll.department = payload.run.departmentScopeId || ""
    appSettings.payroll.forceRegenerate = false
    persistSettings()
    await openPayrollTab("payrollRun", { payrollPayload: payload })
  } catch (error){
    console.error("Failed to open payroll history run", error)
    window.alert(error?.payload?.error?.message || error?.message || "Payroll run could not be opened right now.")
  } finally {
    setActionButtonBusy(button, false)
  }
})
}

if(payrollApprovals){
payrollApprovals.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-approval-index]")
  if(!button) return

  if(!appSettings.payroll.currentRunId){
    return
  }

  const currentUser = getCurrentAuthUserFromState(appState)
  if(!currentUser?.id){
    return
  }

  let payrollPayload
  try{
    payrollPayload = await window.HexaPayApi.getPayrollRun(appSettings.payroll.currentRunId)
  } catch (error){
    console.error("Failed to fetch payroll run for approval", error)
    return
  }

  const approvalIndex = Number(button.dataset.approvalIndex)
  const action = button.dataset.approvalAction || "approve"
  const approval = payrollPayload.run.approvals[approvalIndex]
  if(!approval || approval.status !== "pending"){
    return
  }

    try{
      let updatedPayload

      if(action === "reject"){
        const rejectionReason = await requestTextInput({
          title: "Reject Payroll Run",
          message: "Enter a reason for rejecting this payroll run.",
          placeholder: "Optional rejection reason",
          submitLabel: "Reject",
          allowEmpty: true
        })
        if(rejectionReason === null){
          return
        }
        updatedPayload = await window.HexaPayApi.rejectPayrollRun(appSettings.payroll.currentRunId, currentUser.id, rejectionReason)
        persistSettings()
        await renderPayrollRun(updatedPayload)
      addActivity("Payroll rejected", `${approval.approverName} rejected the ${updatedPayload.run.period} payroll run${rejectionReason ? `: ${rejectionReason}` : "."}`)
      return
    }

    updatedPayload = await window.HexaPayApi.approvePayrollRun(appSettings.payroll.currentRunId, currentUser.id)
    persistSettings()
    await renderPayrollRun(updatedPayload)
    addActivity("Payroll approved", `${approval.approverName} approved the ${updatedPayload.run.period} payroll run.`)
  } catch (error){
    console.error(`Failed to ${action} payroll run`, error)
    window.alert(error?.payload?.error?.message || error?.message || `Payroll ${action} failed.`)
  }
})
}

if(printPayrollPdfButton){
printPayrollPdfButton.addEventListener("click", async () => {
  if(printPayrollPdfButton.disabled){
    return
  }

  if(!hasLiveBackendSession() || !window.HexaPayApi?.exportPayroll){
    alert("Sign in to the live backend before exporting payroll.")
    return
  }

  if(!appSettings.payroll.currentRunId){
    alert("Generate a payroll run before exporting payroll.")
    return
  }

  setActionButtonBusy(printPayrollPdfButton, true, "Exporting...")
  try{
    const result = await window.HexaPayApi.exportPayroll(appSettings.payroll.currentRunId)
    addActivity("Payroll export downloaded", `${result.fileName || appSettings.payroll.due} payroll export was downloaded from the backend.`)
  } catch (error){
    console.error("Payroll export failed.", error)
    alert(error?.payload?.error?.message || error?.message || "Payroll export failed.")
  } finally {
    await renderPayrollApprovals()
    setActionButtonBusy(printPayrollPdfButton, false)
  }
})
}

if(structureSalaryType){
structureSalaryType.addEventListener("change", async () => {
  appSettings.payroll.structureSalaryType = structureSalaryType.value
  persistSettings()
  await renderPayrollStructure()
})
}

if(structureDepartmentFilter){
structureDepartmentFilter.addEventListener("change", async () => {
  appSettings.payroll.structureDepartment = structureDepartmentFilter.value
  persistSettings()
  await renderPayrollStructure()
})
}

if(structureEmployeeSearch){
structureEmployeeSearch.addEventListener("input", async () => {
  appSettings.payroll.structureEmployeeSearch = structureEmployeeSearch.value
  persistSettings()
  await renderPayrollStructure()
})
}

if(structureDeductionType){
structureDeductionType.addEventListener("change", () => {
  toggleStructureLoanFields()
  if(!shouldShowStructureLoanFields()){
    resetStructureLoanFields()
  }
})
}

if(addDeductionButton){
addDeductionButton.addEventListener("click", async () => {
  await addPayrollStructureChange("deduction")
})
}

if(addAllowanceButton){
addAllowanceButton.addEventListener("click", async () => {
  await addPayrollStructureChange("allowance")
})
}

if(structureChangesList){
structureChangesList.addEventListener("click", async (event) => {
  const removeButton = event.target.closest("[data-structure-change-id]")
  if(!removeButton) return

  const changeId = removeButton.dataset.structureChangeId

  try{
    const currentState = latestPayrollStructureState || await window.HexaPayApi.getPayrollStructureApprovalState()
    const removedChange = (currentState?.changes || []).find((change) => String(change.id) === String(changeId))
    latestPayrollStructureState = await window.HexaPayApi.deletePayrollStructureChange(changeId)
    persistSettings()
    await renderPayrollStructure()

    if(removedChange){
      addActivity("Payroll structure change removed", `${removedChange.type} was removed from the edit structure list.`)
    }
  } catch (error){
    console.error("Failed to remove payroll structure change", error)
    window.alert(error.message || "Payroll structure change could not be removed right now.")
  }
})
}

if(structureApprovals){
structureApprovals.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-structure-approval-index]")
  if(!button) return

  const currentUser = getCurrentAuthUserFromState(appState)
  if(!currentUser){
    return
  }

  const approvalIndex = Number(button.dataset.structureApprovalIndex)
  const action = button.dataset.structureAction || "approve"

  try{
    const approvalState = await window.HexaPayApi.getPayrollStructureApprovalState()
    const approval = approvalState.approvals[approvalIndex]
    if(!approval || approval.status !== "pending" || approval.approverId !== currentUser.id){
      return
    }

      if(action === "reject"){
        const rejectionReason = await requestTextInput({
          title: "Reject Structure Changes",
          message: "Enter a reason for rejecting these payroll structure changes.",
          placeholder: "Optional rejection reason",
          submitLabel: "Reject",
          allowEmpty: true
        })
        if(rejectionReason === null){
          return
        }
        const updatedState = await window.HexaPayApi.rejectPayrollStructure(currentUser.id, rejectionReason)
        latestPayrollStructureState = updatedState
        markPayrollRunStale()
        persistSettings()
        await renderPayrollStructure()
        await renderPayrollSection()
        updateDashboardMetrics()
        addActivity("Structure rejected", `${approval.approverName} rejected the payroll structure changes${rejectionReason ? `: ${rejectionReason}` : "."}`)
        return updatedState
      }

    latestPayrollStructureState = await window.HexaPayApi.approvePayrollStructure(currentUser.id)
    markPayrollRunStale()
    persistSettings()
    await renderPayrollStructure()
    await renderPayrollSection()
    updateDashboardMetrics()
    addActivity("Structure approved", `${approval.approverName} approved the payroll structure changes.`)
  } catch (error){
    console.error(`Failed to ${action} payroll structure`, error)
    window.alert(error.message || "Payroll structure approval could not be updated right now.")
  }
})
}

if(printStructurePdfButton){
printStructurePdfButton.addEventListener("click", () => {
  if(printStructurePdfButton.disabled){
    return
  }

  addActivity("Structure PDF ready", "The payroll structure change sheet is ready for printing.")
})
}

if(calendarSalaryType){
calendarSalaryType.addEventListener("change", async () => {
  appSettings.payroll.calendarSalaryType = calendarSalaryType.value
  syncCalendarWorkspaceForType(latestPayrollCalendarState, appSettings.payroll.calendarSalaryType)
  appSettings.payroll.calendarDraftDirty = true
  persistSettings()
  await renderPayCalendar()
})
}

if(paydayDaySelect){
paydayDaySelect.addEventListener("change", async () => {
  appSettings.payroll.paydayDay = paydayDaySelect.value
  appSettings.payroll.calendarDraftDirty = true
  persistSettings()
  await renderPayCalendar()
})
}

if(paydayMonthSelect){
paydayMonthSelect.addEventListener("change", async () => {
  appSettings.payroll.paydayMonth = paydayMonthSelect.value
  const normalizedSelection = getNormalizedPaydaySelection(appSettings.payroll.paydayMonth, appSettings.payroll.paydayDay)
  appSettings.payroll.paydayMonth = normalizedSelection.paydayMonth
  appSettings.payroll.paydayDay = normalizedSelection.paydayDay
  appSettings.payroll.calendarDraftDirty = true
  persistSettings()
  await renderPayCalendar()
})
}

if(setPaydayButton){
setPaydayButton.addEventListener("click", async () => {
  setActionButtonBusy(setPaydayButton, true, "Saving...")
    try{
      const normalizedSelection = getNormalizedPaydaySelection(appSettings.payroll.paydayMonth, appSettings.payroll.paydayDay)
      const selectedPaydayDate = getPaydayDate(normalizedSelection)
      const earliestAllowedDate = parseLocalDateKey(getTomorrowDateKey())

      if(selectedPaydayDate < earliestAllowedDate){
        window.alert("Select a payday after today.")
        setActionButtonBusy(setPaydayButton, false)
        return
      }

    appSettings.payroll.paydayMonth = normalizedSelection.paydayMonth
    appSettings.payroll.paydayDay = normalizedSelection.paydayDay
    latestPayrollCalendarState = await window.HexaPayApi.updatePayrollCalendar({
      salaryType: appSettings.payroll.calendarSalaryType,
      paydayDay: appSettings.payroll.paydayDay,
      paydayMonth: appSettings.payroll.paydayMonth
    })
    appSettings.payroll.calendarDraftDirty = false
    syncPayrollCalendarWorkspace(latestPayrollCalendarState)
    persistSettings()
    await renderPayCalendar()
  } catch (error){
    console.error("Failed to update payroll calendar", error)
    window.alert(error.message || "Payroll calendar could not be updated right now.")
    setActionButtonBusy(setPaydayButton, false)
    return
  }
  addActivity("Payday set", `${calendarNextPayday?.textContent || "A payday was scheduled."}`)
  setActionButtonBusy(setPaydayButton, false)
})
}

if(calendarApprovals){
calendarApprovals.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-calendar-approval-index]")
  if(!button) return

  const currentUser = getCurrentAuthUserFromState(appState)
  if(!currentUser){
    return
  }

  const approvalIndex = Number(button.dataset.calendarApprovalIndex)
  const action = button.dataset.calendarAction || "approve"

  try{
    const approvalState = await window.HexaPayApi.getPayrollCalendarApprovalState()
    const approval = approvalState.approvals[approvalIndex]
    if(!approval || approval.status !== "pending" || approval.approverId !== currentUser.id){
      return
    }

      if(action === "reject"){
        const rejectionReason = await requestTextInput({
          title: "Reject Payroll Calendar",
          message: "Enter a reason for rejecting the scheduled payday.",
          placeholder: "Optional rejection reason",
          submitLabel: "Reject",
          allowEmpty: true
        })
        if(rejectionReason === null){
          return
        }
        latestPayrollCalendarState = await window.HexaPayApi.rejectPayrollCalendar(currentUser.id, rejectionReason)
        persistSettings()
        await renderPayCalendar()
      addActivity("Payroll calendar rejected", `${approval.approverName} rejected the scheduled payday${rejectionReason ? `: ${rejectionReason}` : "."}`)
      return
    }

    latestPayrollCalendarState = await window.HexaPayApi.approvePayrollCalendar(currentUser.id)
    persistSettings()
    await renderPayCalendar()
    addActivity("Payroll calendar approved", `${approval.approverName} approved the scheduled payday.`)
  } catch (error){
    console.error(`Failed to ${action} payroll calendar`, error)
    window.alert(error.message || "Payroll calendar approval could not be updated right now.")
  }
})
}

if(sendPayrollReminderButton){
sendPayrollReminderButton.addEventListener("click", () => {
  addActivity("Payroll reminder queued", `${calendarNextPayday?.textContent || "Payroll reminder prepared."}`)
})
}

if(attendanceRefreshButton){
attendanceRefreshButton.addEventListener("click", () => {
  renderAttendanceTab()
  addActivity("Attendance refreshed", "Attendance totals were recalculated for the current payroll cycle.")
})
}

;[
  attendanceViewMode,
  attendanceDateFilterMode,
  attendanceDateInput,
  attendanceFromInput,
  attendanceToInput,
  attendanceMonthInput,
  attendanceDepartmentFilter
].filter(Boolean).forEach((element) => {
  element.addEventListener("change", () => {
    if(attendanceViewMode){
      appSettings.worktrack.attendanceView = attendanceViewMode.value
    }
    if(attendanceDateFilterMode){
      appSettings.worktrack.attendanceDateFilterMode = attendanceDateFilterMode.value
    }
    if(attendanceDateInput){
      appSettings.worktrack.attendanceDate = attendanceDateInput.value
    }
    if(attendanceFromInput){
      appSettings.worktrack.attendanceFrom = attendanceFromInput.value
    }
    if(attendanceToInput){
      appSettings.worktrack.attendanceTo = attendanceToInput.value
    }
    if(attendanceMonthInput){
      appSettings.worktrack.attendanceMonth = attendanceMonthInput.value
    }
    if(attendanceDepartmentFilter){
      appSettings.worktrack.attendanceDepartmentId = attendanceDepartmentFilter.value
    }
    persistSettings()
    renderAttendanceTab()
  })
})

if(attendanceExportButton){
attendanceExportButton.addEventListener("click", async () => {
  if(!hasLiveBackendSession() || !window.HexaPayApi?.exportAttendance){
    alert("Sign in to the live backend before exporting attendance.")
    return
  }

  setActionButtonBusy(attendanceExportButton, true, "Exporting...")
  try{
    const result = await window.HexaPayApi.exportAttendance(getAttendanceExportFilters())
    addActivity("Attendance export downloaded", `${result.fileName || "Attendance export"} was downloaded from the backend.`)
  } catch (error){
    console.error("Attendance export failed.", error)
    alert(error?.payload?.error?.message || error?.message || "Attendance export failed.")
  } finally {
    setActionButtonBusy(attendanceExportButton, false)
  }
})
}

if(attendanceEmployeeSearch){
attendanceEmployeeSearch.addEventListener("input", () => {
  populateWorktrackEmployeeSelects(attendanceEmployeeSearch.value)
})
}

if(saveAttendanceEntryButton){
saveAttendanceEntryButton.addEventListener("click", async () => {
  const employeeId = attendanceEmployeeSelect?.value || ""
  const entryDate = attendanceEntryDate?.value || ""
  const checkIn = attendanceCheckIn?.value || ""
  const checkOut = attendanceCheckOut?.value || ""
  if(!employeeId || !entryDate || !checkIn || !checkOut){
    window.alert("Employee, date, check-in, and check-out are required for attendance.")
    return
  }

  const employee = getEmployeeById(employeeId)
  if(!employee){
    window.alert("Select a valid employee before saving attendance.")
    return
  }

  if(hasLiveBackendSession() && !/^[a-f\d]{24}$/i.test(String(employee.id || "").trim())){
    window.alert("Select a valid live employee record before saving attendance.")
    return
  }

  setActionButtonBusy(saveAttendanceEntryButton, true, "Saving...")
  try{
      const logRecord = await window.HexaPayApi.createAttendanceLog({
        companyId: employee.companyId,
        employeeId: employee.id,
        employeeName: employee.fullName,
        departmentId: employee.departmentId,
        departmentName: getEmployeeDepartmentName(employee),
        roleTitle: employee.roleTitle,
      date: entryDate,
      checkIn,
      checkOut,
      mode: "Manual",
      approvals: getDefaultAttendanceApprovals()
    })

    selectedAttendanceEntryId = logRecord.id
    appState.attendance.selectedLogId = logRecord.id
    appSettings.worktrack.attendanceDate = entryDate
    if(attendanceCheckIn){
      attendanceCheckIn.value = ""
    }
    if(attendanceCheckOut){
      attendanceCheckOut.value = ""
      }
      persistSettings()
      renderAttendanceTab()
      addActivity("Attendance saved", `${employee.fullName} was manually checked in for ${entryDate} and is awaiting approval.`)
    } catch (error){
      console.error("Failed to save attendance entry", error)
      const validationDetails = Array.isArray(error?.payload?.error?.details)
        ? error.payload.error.details.map((detail) => detail?.message).filter(Boolean).join("\n")
        : ""
      window.alert(validationDetails || error?.payload?.error?.message || error?.message || "Attendance entry could not be saved.")
  } finally {
    setActionButtonBusy(saveAttendanceEntryButton, false)
  }
})
}

if(attendanceApprovalList){
attendanceApprovalList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-attendance-approval-index]")
  if(!button) return

  const currentUser = getCurrentAuthUserFromState(appState)
  if(!currentUser || !selectedAttendanceEntryId){
    return
  }

  const approvalIndex = Number(button.dataset.attendanceApprovalIndex)
  try{
    const payload = await window.HexaPayApi.getAttendanceLog(selectedAttendanceEntryId)
    const approval = payload.log.approvals[approvalIndex]
    if(!approval || getApprovalStatus(approval) !== "pending" || getApprovalActorId(approval) !== currentUser.id){
      return
    }

    const updatedPayload = await window.HexaPayApi.approveAttendanceLog(selectedAttendanceEntryId, currentUser.id)
    persistSettings()
    renderAttendanceTab()
    addActivity("Attendance approved", `${approval.approverName} approved ${updatedPayload.log.employeeName}'s attendance for ${updatedPayload.log.date}.`)
  } catch (error){
    console.error("Failed to approve attendance log", error)
    window.alert(error?.payload?.error?.message || error?.message || "Attendance approval failed.")
  }
})
}

if(attendanceTableBody){
attendanceTableBody.addEventListener("click", (event) => {
  const row = event.target.closest("[data-attendance-log-id]")
  if(!row) return

  const matchingEntry = getAttendanceLogById(row.dataset.attendanceLogId)
  if(!matchingEntry) return

  selectedAttendanceEntryId = matchingEntry.id
  appState.attendance.selectedLogId = matchingEntry.id
  renderAttendanceApprovals()
})
}

if(pendingLeaveTableBody){
pendingLeaveTableBody.addEventListener("click", (event) => {
  const row = event.target.closest("[data-pending-leave-id]")
  if(!row) return

  selectedPendingLeaveId = row.dataset.pendingLeaveId
  appState.leave.selectedRequestId = selectedPendingLeaveId
  renderLeaveManagementTab()
})
}

if(leaveApprovalList){
leaveApprovalList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-leave-approval-index]")
  if(!button) return

  const currentUser = getCurrentAuthUserFromState(appState)
  if(!currentUser || !selectedPendingLeaveId){
    return
  }

  const approvalIndex = Number(button.dataset.leaveApprovalIndex)
  try{
    const payload = await window.HexaPayApi.getLeaveRequest(selectedPendingLeaveId)
    const approval = payload.request.approvals[approvalIndex]
    if(!approval || getApprovalStatus(approval) !== "pending" || getApprovalActorId(approval) !== currentUser.id){
      return
    }

      const updatedPayload = await window.HexaPayApi.approveLeaveRequest(selectedPendingLeaveId, currentUser.id)
      await window.HexaPayApi.getEmployees()
      persistSettings()
      renderLeaveManagementTab()
      renderWorkforceSection()
      addActivity("Leave approved", `${approval.approverName} approved ${updatedPayload.request.employeeName}'s ${updatedPayload.request.leaveType.toLowerCase()} request.`)
  } catch (error){
    console.error("Failed to approve leave request", error)
    window.alert(error?.payload?.error?.message || error?.message || "Leave approval failed.")
  }
})
}

if(rejectLeaveButton){
rejectLeaveButton.addEventListener("click", async () => {
  const currentUser = getCurrentAuthUserFromState(appState)
  if(!currentUser || !selectedPendingLeaveId){
    return
  }

  try{
    const payload = await window.HexaPayApi.getLeaveRequest(selectedPendingLeaveId)
    const approval = payload.request.approvals.find((item) =>
      getApprovalActorId(item) === currentUser.id && getApprovalStatus(item) === "pending"
    )
    if(!approval){
      return
    }

    const rejectionReason = await requestTextInput({
      title: "Reject Leave Request",
      message: "Enter a reason for rejecting this leave request.",
      placeholder: "Optional rejection reason",
      submitLabel: "Reject",
      allowEmpty: true
    })
    if(rejectionReason === null){
      return
    }
    const updatedPayload = await window.HexaPayApi.rejectLeaveRequest(selectedPendingLeaveId, currentUser.id, rejectionReason)
    persistSettings()
    renderLeaveManagementTab()
    addActivity("Leave rejected", `${approval.approverName} rejected ${updatedPayload.request.employeeName}'s ${updatedPayload.request.leaveType.toLowerCase()} request${rejectionReason ? `: ${rejectionReason}` : "."}`)
  } catch (error){
    console.error("Failed to reject leave request", error)
    window.alert(error?.payload?.error?.message || error?.message || "Leave rejection failed.")
  }
})
  }

async function returnEmployeeFromLeave(requestId, employeeId){
  const employee = getEmployeeById(employeeId)
  if(!employee){
    window.alert("Employee record was not found.")
    return
  }

  try{
    if(String(requestId || "").startsWith("status-leave-")){
      await window.HexaPayApi.updateEmployee(employee.id, {
        status: "ACTIVE",
        payrollStatus: "pending"
      })
    } else {
      await window.HexaPayApi.completeLeaveRequest(requestId)
    }

    await window.HexaPayApi.getEmployees()
    await window.HexaPayApi.getLeaveRequests()
    renderLeaveManagementTab()
    renderWorkforceSection()
    updateDashboardMetrics()
    addActivity("Employee returned from leave", `${employee.fullName} was marked active again.`)
  } catch (error){
    console.error("Failed to return employee from leave", error)
    window.alert(error?.payload?.error?.message || error?.message || "Employee could not be returned from leave.")
  }
}

if(addLeaveRequestButton){
addLeaveRequestButton.addEventListener("click", async () => {
  const employeeId = leaveEmployeeSelect?.value || ""
  const type = leaveTypeInput?.value || ""
  const from = leaveFromInput?.value || ""
  const to = leaveToInput?.value || ""
  if(!employeeId || !type || !from || !to){
    window.alert("Employee, leave type, and leave dates are required.")
    return
  }

  const employee = getEmployeeById(employeeId)
  if(!employee){
    window.alert("Select a valid employee before creating leave.")
    return
  }

  setActionButtonBusy(addLeaveRequestButton, true, "Saving...")
  try{
      const request = await window.HexaPayApi.createLeaveRequest({
        companyId: employee.companyId,
        employeeId: employee.id,
        employeeName: employee.fullName,
        leaveType: type,
        departmentId: employee.departmentId,
        departmentName: getEmployeeDepartmentName(employee),
      fromDate: from,
      toDate: to,
      requestedDate: new Date().toISOString().slice(0, 10),
      approvals: mergeApprovalTemplates([], buildWorkflowApprovalTemplates(appState, "leave"))
    })

    selectedPendingLeaveId = request.id
    appState.leave.selectedRequestId = request.id
    if(leaveFromInput){
      leaveFromInput.value = ""
    }
    if(leaveToInput){
      leaveToInput.value = ""
      }
      persistSettings()
      renderLeaveManagementTab()
      addActivity("Leave request added", `${employee.fullName} was added to pending leave approvals.`)
    } catch (error){
      console.error("Failed to add leave request", error)
      window.alert(error?.payload?.error?.details?.[0]?.message || error?.payload?.error?.message || error?.message || "Leave request could not be created.")
    } finally {
      setActionButtonBusy(addLeaveRequestButton, false)
    }
  })
  }

if(activeLeaveTableBody){
activeLeaveTableBody.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-return-leave-id]")
  if(!button) return

  const requestId = String(button.dataset.returnLeaveId || "")
  const employeeId = String(button.dataset.returnEmployeeId || "")
  if(!requestId || !employeeId){
    return
  }

  await returnEmployeeFromLeave(requestId, employeeId)
})
}

  if(overtimeRatesBody){
overtimeRatesBody.addEventListener("click", (event) => {
  const row = event.target.closest("[data-overtime-rate-id]")
  if(!row) return

  const rateId = String(row.dataset.overtimeRateId || "")
  const rate = appSettings.worktrack.overtimeRates.find((item) => String(item.id) === rateId)
  if(!rate) return

  selectedOvertimeRateId = rate.id
  overtimeDepartmentInput.value = rate.departmentId || ""
  renderOvertimeRoleOptions()
  overtimeRoleInput.value = rate.role
  overtimeRateInput.value = String(rate.rate)
  if(saveOvertimeRateButton){
    saveOvertimeRateButton.textContent = "Update Rate"
  }
  if(deleteOvertimeRateButton){
    deleteOvertimeRateButton.disabled = false
    deleteOvertimeRateButton.classList.remove("btn-disabled")
  }
  renderOvertimeTab()
})
}

if(overtimeDepartmentInput){
overtimeDepartmentInput.addEventListener("change", () => {
  renderOvertimeRoleOptions()
})
}

if(saveOvertimeRateButton){
saveOvertimeRateButton.addEventListener("click", async () => {
  const departmentId = overtimeDepartmentInput?.value || ""
  const department = getDepartmentById(departmentId)
  const role = overtimeRoleInput?.value || ""
  const rate = Number(overtimeRateInput?.value || 0)

  if(!departmentId || !department || !role || !rate){
    return
  }

  const existingRate = appSettings.worktrack.overtimeRates.find((item) =>
    String(item.id) === String(selectedOvertimeRateId)
  ) || appSettings.worktrack.overtimeRates.find((item) =>
    String(item.departmentId) === String(departmentId) &&
    item.role.toLowerCase() === role.toLowerCase()
  )

  try{
    setActionButtonBusy(saveOvertimeRateButton, true, "Saving...")
    const payload = {
      rule_type: "overtime_rate",
      name: role,
      value_type: "hourly_rate",
      value: rate,
      scope: "department",
      target_type: "department",
      target_id: departmentId,
      status: "active"
    }
    const response = existingRate?.backendRuleId
      ? await window.HexaPayApi.updateFinancialRule(existingRate.backendRuleId, payload)
      : await window.HexaPayApi.createFinancialRule(payload)

    if(response?.financial_rule){
      const syncedRule = response.financial_rule
      const nextRate = {
        id: syncedRule.id,
        backendRuleId: syncedRule.id,
        departmentId,
        department: department.name,
        role,
        rate,
        updatedAt: String(syncedRule.effective_from || syncedRule.updated_at || new Date().toISOString()).slice(0, 10)
      }
      upsertById(appSettings.worktrack.overtimeRates, nextRate)
      selectedOvertimeRateId = nextRate.id
    } else if(existingRate){
      existingRate.rate = rate
      existingRate.updatedAt = new Date().toISOString().slice(0, 10)
    } else {
      appSettings.worktrack.overtimeRates.push({
        id: Date.now(),
        departmentId,
        department: department.name,
        role,
        rate,
        updatedAt: new Date().toISOString().slice(0, 10)
      })
    }

    renderOvertimeTab()
    addActivity("Overtime rate saved", `${department.name} ${role} overtime was set to ${getCurrencyFormatter().format(rate)} per hour.`)
  } catch (error){
    console.error("Failed to save overtime rate.", error)
    window.alert(error?.payload?.error?.message || error?.message || "Overtime rate could not be saved.")
  } finally {
    setActionButtonBusy(saveOvertimeRateButton, false)
  }
})
}

if(deleteOvertimeRateButton){
deleteOvertimeRateButton.addEventListener("click", async () => {
  const selectedRate = appSettings.worktrack.overtimeRates.find((rate) => String(rate.id) === String(selectedOvertimeRateId))
  if(!selectedRate){
    return
  }

  if(!window.confirm(`Delete the overtime rate for ${selectedRate.department} ${selectedRate.role}?`)){
    return
  }

  try{
    setActionButtonBusy(deleteOvertimeRateButton, true, "Deleting...")
    if(selectedRate.backendRuleId){
      await window.HexaPayApi.deleteFinancialRule(selectedRate.backendRuleId)
    }
    appSettings.worktrack.overtimeRates = appSettings.worktrack.overtimeRates.filter((rate) => String(rate.id) !== String(selectedRate.id))
    resetOvertimeRateEditor()
    renderOvertimeTab()
    addActivity("Overtime rate deleted", `${selectedRate.department} ${selectedRate.role} overtime was removed.`)
  } catch (error){
    console.error("Failed to delete overtime rate.", error)
    window.alert(error?.payload?.error?.message || error?.message || "Overtime rate could not be deleted.")
  } finally {
    setActionButtonBusy(deleteOvertimeRateButton, false)
  }
})
}

if(addCompanyHolidayButton){
addCompanyHolidayButton.addEventListener("click", async () => {
  const name = companyHolidayNameInput?.value.trim() || ""
  const date = companyHolidayDateInput?.value || ""
  if(!name || !date){
    return
  }

  try{
    setActionButtonBusy(addCompanyHolidayButton, true, "Saving...")
    const isEditingHoliday = Boolean(selectedCompanyHolidayId)
    if(selectedCompanyHolidayId){
      await window.HexaPayApi.updateHoliday(selectedCompanyHolidayId, {
        scope: "company",
        name,
        date
      })
    } else {
      await window.HexaPayApi.createHoliday({
        scope: "company",
        name,
        date
      })
    }
    resetHolidayEditor("company")
    renderHolidayTab()
    addActivity(
      isEditingHoliday ? "Company holiday updated" : "Company holiday added",
      `${name} was ${isEditingHoliday ? "updated in" : "added to"} the company holiday calendar.`
    )
  } catch (error){
    console.error("Failed to save company holiday.", error)
    window.alert(error?.payload?.error?.message || error?.message || "Company holiday could not be saved.")
  } finally {
    setActionButtonBusy(addCompanyHolidayButton, false)
  }
})
}

if(deleteCompanyHolidayButton){
deleteCompanyHolidayButton.addEventListener("click", async () => {
  const holiday = getHolidayByScopeAndId("company", selectedCompanyHolidayId)
  if(!holiday){
    return
  }

  if(!window.confirm(`Delete ${holiday.name}?`)){
    return
  }

  try{
    setActionButtonBusy(deleteCompanyHolidayButton, true, "Deleting...")
    await window.HexaPayApi.deleteHoliday(holiday.id)
    resetHolidayEditor("company")
    renderHolidayTab()
    addActivity("Company holiday deleted", `${holiday.name} was removed from the company holiday calendar.`)
  } catch (error){
    console.error("Failed to delete company holiday.", error)
    window.alert(error?.payload?.error?.message || error?.message || "Company holiday could not be deleted.")
  } finally {
    setActionButtonBusy(deleteCompanyHolidayButton, false)
  }
})
}

if(companyHolidayBody){
companyHolidayBody.addEventListener("click", (event) => {
  const row = event.target.closest("[data-holiday-id][data-holiday-scope='company']")
  if(!row){
    return
  }

  selectedCompanyHolidayId = row.dataset.holidayId
  populateHolidayEditor("company", getHolidayByScopeAndId("company", selectedCompanyHolidayId))
  renderHolidayTab()
})
}

if(addNationalHolidayButton){
addNationalHolidayButton.addEventListener("click", async () => {
  const name = nationalHolidayNameInput?.value.trim() || ""
  const date = nationalHolidayDateInput?.value || ""
  if(!name || !date){
    return
  }

  try{
    setActionButtonBusy(addNationalHolidayButton, true, "Saving...")
    const isEditingHoliday = Boolean(selectedNationalHolidayId)
    if(selectedNationalHolidayId){
      await window.HexaPayApi.updateHoliday(selectedNationalHolidayId, {
        scope: "national",
        name,
        date
      })
    } else {
      await window.HexaPayApi.createHoliday({
        scope: "national",
        name,
        date
      })
    }
    resetHolidayEditor("national")
    renderHolidayTab()
    addActivity(
      isEditingHoliday ? "National holiday updated" : "National holiday added",
      `${name} was ${isEditingHoliday ? "updated in" : "added to"} the national holiday list.`
    )
  } catch (error){
    console.error("Failed to save national holiday.", error)
    window.alert(error?.payload?.error?.message || error?.message || "National holiday could not be saved.")
  } finally {
    setActionButtonBusy(addNationalHolidayButton, false)
  }
})
}

if(deleteNationalHolidayButton){
deleteNationalHolidayButton.addEventListener("click", async () => {
  const holiday = getHolidayByScopeAndId("national", selectedNationalHolidayId)
  if(!holiday){
    return
  }

  if(!window.confirm(`Delete ${holiday.name}?`)){
    return
  }

  try{
    setActionButtonBusy(deleteNationalHolidayButton, true, "Deleting...")
    await window.HexaPayApi.deleteHoliday(holiday.id)
    resetHolidayEditor("national")
    renderHolidayTab()
    addActivity("National holiday deleted", `${holiday.name} was removed from the national holiday list.`)
  } catch (error){
    console.error("Failed to delete national holiday.", error)
    window.alert(error?.payload?.error?.message || error?.message || "National holiday could not be deleted.")
  } finally {
    setActionButtonBusy(deleteNationalHolidayButton, false)
  }
})
}

if(nationalHolidayBody){
nationalHolidayBody.addEventListener("click", (event) => {
  const row = event.target.closest("[data-holiday-id][data-holiday-scope='national']")
  if(!row){
    return
  }

  selectedNationalHolidayId = row.dataset.holidayId
  populateHolidayEditor("national", getHolidayByScopeAndId("national", selectedNationalHolidayId))
  renderHolidayTab()
})
}

if(insightsAnalyticsFilter){
insightsAnalyticsFilter.addEventListener("change", () => {
  appSettings.insights.analyticsFilter = insightsAnalyticsFilter.value
  persistSettings()
  renderAnalyticsTab()
})
}

if(insightsDecisionFocus){
insightsDecisionFocus.addEventListener("change", () => {
  appSettings.insights.decisionFocus = insightsDecisionFocus.value
  persistSettings()
  renderAIInsightsTab()
})
}

if(calculatePayeButton){
calculatePayeButton.addEventListener("click", () => {
  appSettings.financials.calculator = appSettings.financials.calculator || {
    grossSalary: "",
    result: null,
    validationMessage: ""
  }
  const grossSalaryInput = payeCalculatorGrossSalary?.value || ""
  const validationMessage = validateGrossSalaryInputValue(grossSalaryInput)
  appSettings.financials.calculator.grossSalary = grossSalaryInput
  appSettings.financials.calculator.validationMessage = validationMessage

  if(validationMessage){
    appSettings.financials.calculator.result = null
  } else {
    appSettings.financials.calculator.result = calculatePayrollPreviewFromConfig({
      grossSalary: Number(grossSalaryInput || 0),
      config: getEffectiveStatutoryConfiguration()
    })
  }

  persistSettings()
  renderFinancialRulesTab()
})
}

if(payeCalculatorGrossSalary){
  payeCalculatorGrossSalary.addEventListener("input", () => {
    appSettings.financials.calculator = appSettings.financials.calculator || {
      grossSalary: "",
      result: null,
      validationMessage: ""
    }

    appSettings.financials.calculator.grossSalary = payeCalculatorGrossSalary.value || ""
    appSettings.financials.calculator.validationMessage = ""
    appSettings.financials.calculator.result = null
  })
}

if(financialEmployeeSearch){
financialEmployeeSearch.addEventListener("input", () => {
  appSettings.financials.employeeSearch = financialEmployeeSearch.value
  persistSettings()
  renderFinancialEmployeeRuleEditor()
})
}

if(financialEmployeeSelect){
financialEmployeeSelect.addEventListener("change", () => {
  appSettings.financials.selectedEmployeeId = financialEmployeeSelect.value
  persistSettings()
  renderFinancialEmployeeRuleEditor()
})
}

if(financialEmployeeApplyTaxButton){
financialEmployeeApplyTaxButton.addEventListener("click", () => {
  const nextState = financialEmployeeApplyTaxButton.dataset.active !== "true"
  setTaxFinancialButtonState(financialEmployeeApplyTaxButton, nextState)
  setTaxFinancialVisibility(financialEmployeeTaxOptions, nextState)
})
}

if(saveFinancialEmployeeRulesButton){
saveFinancialEmployeeRulesButton.addEventListener("click", async () => {
  const employee = getSelectedFinancialEmployee()
  if(!employee){
    window.alert("Select an employee before saving individual statutory rules.")
    return
  }

  const nextFinancialProfile = normalizeEmployeeFinancialProfile({
    ...employee.financialProfile,
    applyTaxFinancials: financialEmployeeApplyTaxButton?.dataset.active === "true",
    statutory: {
      paye: Boolean(financialEmployeeApplyPaye?.checked),
      shif: Boolean(financialEmployeeApplyShif?.checked),
      nssf: Boolean(financialEmployeeApplyNssf?.checked),
      housingLevy: Boolean(financialEmployeeApplyHousingLevy?.checked)
    }
  })

  setActionButtonBusy(saveFinancialEmployeeRulesButton, true, "Saving...")
  try{
    const updatedEmployee = await window.HexaPayApi.updateEmployee(employee.id, {
      financialProfile: nextFinancialProfile
    })
    markPayrollRunStale()
    await window.HexaPayApi.getEmployees()
    appSettings.financials.selectedEmployeeId = updatedEmployee.id
    persistSettings()
    renderFinancialsSection()
    renderWorkforceSection()
    await renderPayrollSection()
    updateDashboardMetrics()
    addActivity("Employee statutory rules updated", `${updatedEmployee.fullName}'s individual statutory deductions were updated.`)
  } catch (error){
    console.error("Failed to save individual statutory rules.", error)
    window.alert(error?.payload?.error?.message || error?.message || "Individual statutory rules could not be saved.")
  } finally {
    setActionButtonBusy(saveFinancialEmployeeRulesButton, false)
  }
})
}

if(addCustomDeductionButton){
addCustomDeductionButton.addEventListener("click", async () => {
  const name = customDeductionName?.value.trim() || ""
  const type = customDeductionType?.value || "percentage"
  const value = Number(customDeductionValue?.value || 0)
  if(!name || !value){
    return
  }

  let backendRuleId = null
  if(hasLiveBackendSession() && window.HexaPayApi){
    try{
      const response = await window.HexaPayApi.createFinancialRule({
        rule_type: "custom_deduction",
        name,
        value_type: normalizeFinancialRuleValueTypeForBackend(type),
        value,
        scope: "company",
        status: "active"
      })
      backendRuleId = response?.financial_rule?.id || null
    } catch (error){
      console.error("Failed to save custom deduction to backend.", error)
    }
  }

  appSettings.financials.customDeductions.push({
    id: backendRuleId || createStateEntityId("custom-deduction"),
    backendRuleId,
    name,
    type,
    value
  })

  customDeductionName.value = ""
  customDeductionValue.value = ""
  markPayrollRunStale()
  persistSettings()
  renderFinancialsSection()
  await renderPayrollSection()
  updateDashboardMetrics()
  addActivity("Custom deduction added", `${name} was added to the financial deduction rules.`)
})
}

if(customDeductionList){
customDeductionList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-custom-deduction-id]")
  if(!button) return

  const deductionId = String(button.dataset.customDeductionId)
  const deduction = appSettings.financials.customDeductions.find((item) =>
    String(item.backendRuleId || item.id) === deductionId
  )
  if(!deduction){
    return
  }

  if(hasLiveBackendSession() && deduction.backendRuleId && window.HexaPayApi){
    try{
      await window.HexaPayApi.deleteFinancialRule(deduction.backendRuleId)
    } catch (error){
      console.error("Failed to remove custom deduction from backend.", error)
      return
    }
  }

  appSettings.financials.customDeductions = appSettings.financials.customDeductions.filter((item) =>
    String(item.backendRuleId || item.id) !== deductionId
  )
  markPayrollRunStale()
  persistSettings()
  renderFinancialsSection()
  await renderPayrollSection()
  updateDashboardMetrics()

  if(deduction){
    addActivity("Custom deduction removed", `${deduction.name} was removed from financial rules.`)
  }
})
}

if(financialIncentiveScope){
financialIncentiveScope.addEventListener("change", () => {
  renderFinancialIncentiveTargets()
})
}

if(addFinancialIncentiveButton){
addFinancialIncentiveButton.addEventListener("click", async () => {
  const name = financialIncentiveName?.value.trim() || ""
  const type = financialIncentiveType?.value || "Bonus"
  const scope = financialIncentiveScope?.value || "company"
  const target = financialIncentiveTarget?.value || String(getActiveCompany()?.id || appSettings.company.name)
  const targetLabel = financialIncentiveTarget?.selectedOptions?.[0]?.textContent || getFinancialIncentiveTargetLabel({ scope, targetId: target })
  const amount = Number(financialIncentiveAmount?.value || 0)
  const taxable = financialIncentiveTaxable?.checked !== false
  if(!name || !amount){
    return
  }

  let backendRuleId = null
  const normalizedScope = normalizeFinancialRuleScopeForBackend(scope)
  if(hasLiveBackendSession() && window.HexaPayApi){
    try{
      const response = await window.HexaPayApi.createFinancialRule({
        rule_type: String(type || "Bonus").toLowerCase() === "incentive" ? "incentive" : "bonus",
        name,
        value_type: "flat_amount",
        value: amount,
        taxable,
        income_category: String(type || "Bonus").toLowerCase() === "incentive" ? "incentive" : "bonus",
        scope: normalizedScope,
        target_type: normalizedScope === "department" ? "department" : normalizedScope === "employee" ? "employee" : null,
        target_id: normalizedScope === "department" || normalizedScope === "employee" ? target : null,
        status: "active"
      })
      backendRuleId = response?.financial_rule?.id || null
    } catch (error){
      console.error("Failed to save financial incentive to backend.", error)
    }
  }

  appSettings.financials.incentives.push({
    id: backendRuleId || createStateEntityId("financial-incentive"),
    backendRuleId,
    name,
    type,
    scope,
    target: targetLabel,
    targetId: target,
    targetType: normalizedScope === "department" ? "department" : normalizedScope === "employee" ? "employee" : null,
    taxable,
    incomeCategory: String(type || "Bonus").toLowerCase() === "incentive" ? "incentive" : "bonus",
    amount
  })

  financialIncentiveName.value = ""
  financialIncentiveAmount.value = ""
  if(financialIncentiveTaxable){
    financialIncentiveTaxable.checked = true
  }
  markPayrollRunStale()
  persistSettings()
  renderFinancialsSection()
  await renderPayrollSection()
  updateDashboardMetrics()
  addActivity("Incentive added", `${name} was added as a ${scope} ${type.toLowerCase()} rule.`)
})
}

if(financialReportDepartment){
financialReportDepartment.addEventListener("change", () => {
  appSettings.financials.reportDepartment = financialReportDepartment.value
  persistSettings()
  renderFinancialReportsTab()
})
}

if(saveCompanyProfileButton){
saveCompanyProfileButton.addEventListener("click", async () => {
  appSettings.company.name = companyEditName.value.trim() || defaultSettings.company.name
  appSettings.company.industry = companyIndustry.value.trim() || defaultSettings.company.industry
  appSettings.company.email = companyEmail.value.trim() || defaultSettings.company.email
  appSettings.company.logoUrl = selectedCompanyLogo || appSettings.company.logoUrl || ""

  setActionButtonBusy(saveCompanyProfileButton, true, "Saving...")
  if(hasLiveBackendSession() && window.HexaPayApi?.updateCompany){
    try{
      await window.HexaPayApi.updateCompany({
        name: appSettings.company.name,
        industry: appSettings.company.industry,
        email: appSettings.company.email,
        logo_url: appSettings.company.logoUrl || ""
      })
    } catch (error){
      console.error("Failed to save company profile to backend.", error)
      setProfileAuthMessage(error?.message || "Company profile save failed.", "error")
      renderProfileState()
      setActionButtonBusy(saveCompanyProfileButton, false)
      return
    }
  }

  syncActiveCompany()
  persistSettings()
  renderCompanySettings()
  renderCompanyDropdown()
  renderProfileState()
  renderPayrollSection()
  addActivity("Company profile updated", `${appSettings.company.name} details were saved.`)
  setActionButtonBusy(saveCompanyProfileButton, false)
})
}

if(companyLogoutButton){
companyLogoutButton.addEventListener("click", async () => {
  setActionButtonBusy(companyLogoutButton, true, "Signing out...")
  try{
    await performCompanyLogout()
  } finally {
    setActionButtonBusy(companyLogoutButton, false)
  }
})
}

if(currencySelect){
currencySelect.addEventListener("change", () => {
  appState.settings.ui.pendingCurrencySelection = currencySelect.value
  appState.settings.ui.currencyApplyMessage = ""
  renderCompanySettings()
})
}

if(applyCurrencyButton){
applyCurrencyButton.onclick = applySelectedCurrency
}

if(memberList){
memberList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-member-id]")

  if(!button){
    return
  }

  const memberId = button.dataset.memberId
  const memberAction = button.dataset.memberAction || ""
  const targetMember = appSettings.members.find((member) => String(member.id) === String(memberId))
  if(!targetMember){
    return
  }

  if(memberAction !== "promote" && memberAction !== "demote"){
    return
  }

  const nextRole = String(button.dataset.memberRole || "").trim().toUpperCase()

  if(!nextRole){
    return
  }

  const isAdminDemotion = normalizeAuthRole(targetMember.role) === "Admin" && nextRole !== "ADMIN"
  if(isAdminDemotion){
    const activeAdminCount = appSettings.members.filter((member) => {
      const normalizedStatus = String(member.status || "active").trim().toLowerCase()
      return normalizedStatus !== "removed" &&
        normalizedStatus !== "suspended" &&
        normalizeAuthRole(member.role) === "Admin"
    }).length

    if(activeAdminCount <= 1){
      setProfileAuthMessage("At least one active admin must remain on the company.", "error")
      renderProfileState()
      return
    }
  }

  setActionButtonBusy(button, true, "Saving...")
  try{
    if(window.HexaPayApi?.updateMembership){
      await window.HexaPayApi.updateMembership(memberId, {
        role: nextRole
      })
    }
  } catch (error){
    console.error(`Failed to ${memberAction} member.`, error)
    setProfileAuthMessage(
      error?.payload?.error?.message ||
      error?.message ||
      `User ${memberAction === "demote" ? "demotion" : "promotion"} failed.`,
      "error"
    )
    renderProfileState()
    setActionButtonBusy(button, false)
    return
  }

  targetMember.role = normalizeAuthRole(nextRole)
  persistSettings()
  renderMembers()
  setProfileAuthMessage(
    `${targetMember.name} was ${memberAction === "demote" ? "demoted" : "promoted"} successfully.`,
    "success"
  )
  renderProfileState()
  addActivity(
    `User ${memberAction === "demote" ? "demoted" : "promoted"}`,
    `${targetMember.name} was ${memberAction === "demote" ? "demoted" : "promoted"} to ${normalizeAuthRole(nextRole)}.`
  )
  setActionButtonBusy(button, false)
})
}

themeOptions.forEach((option) => {
option.addEventListener("click", () => {
  appSettings.appearance.theme = option.dataset.themeOption
  persistSettings()
  applyTheme()
  addActivity("Theme changed", `Theme preference set to ${option.dataset.themeOption}.`)
})
})

if(fontScaleRange){
fontScaleRange.addEventListener("input", () => {
  appSettings.appearance.fontScale = Number(fontScaleRange.value)
  persistSettings()
  applyTheme()
})

fontScaleRange.addEventListener("change", () => {
  addActivity("Font scaling updated", `Interface scale set to ${appSettings.appearance.fontScale}%.`)
})
}

const systemThemeListener = window.matchMedia("(prefers-color-scheme: dark)")
systemThemeListener.addEventListener("change", () => {
if(appSettings.appearance.theme === "system"){
  applyTheme()
}
})

async function handleProfileSignupButtonClick(){
  const companyName = profileSignupCompany.value.trim() || appSettings.company.name
  const email = profileSignupEmail.value.trim()
  const logoUrl = selectedSignupCompanyLogo || ""
  const passwordHint = profileSignupPassword.value.trim()

  if(!email || !passwordHint){
    setProfileAuthMessage("Company email and password are required to sign up.", "error")
    renderProfileState()
    return
  }

  if(!isStrongPassword(passwordHint)){
    setProfileAuthMessage(getPasswordRequirementMessage(), "error")
    renderProfileState()
    return
  }

  setActionButtonBusy(profileSignupButton, true, "Creating...")
  try{
    if(window.HexaPayApi?.register){
      const session = await window.HexaPayApi.register({
        email,
        password: passwordHint,
        displayName: companyName,
        company: {
          name: companyName,
          industry: appSettings.company.industry || "Business Services",
          currencyCode: appSettings.company.currency || "KES",
          countryCode: "KE",
          timezone: "Africa/Nairobi",
          logoUrl
        }
      })

      resetBackendDrivenViewSyncState()
      persistSettings()
      selectedCompanyLogo = logoUrl
      selectedSignupCompanyLogo = ""
      if(profileSignupLogo){
        profileSignupLogo.value = ""
      }
      await window.HexaPayApi.getMemberships?.().catch((error) => {
        console.error("Failed to sync company memberships after signup.", error)
      })
      await window.HexaPayApi.getCompany?.().catch((error) => {
        console.error("Failed to sync active company after signup.", error)
      })
      setProfileAuthMessage(`Company account created successfully for ${companyName}.`, "success")
      await syncOverviewDataFromBackend({ force: true })
      renderCompanySettings()
      renderCompanyDropdown()
      renderProfileState()
      updateDashboardMetrics()
      renderWorkforceSection()
      renderWorktrackSection()
      renderPayrollSection()
      profileLoginEmail.value = email
      profileSignupPassword.value = ""
      addActivity("Company profile created", `${companyName} company profile was created and signed in successfully.`)
      setActionButtonBusy(profileSignupButton, false)
      return
    }
  } catch (error){
    console.error("Backend signup failed.", error)
    setProfileAuthMessage(error?.payload?.error?.details?.[0]?.message || error?.message || "Sign up failed. Please review your details and try again.", "error")
    renderProfileState()
    setActionButtonBusy(profileSignupButton, false)
    return
  }
}

async function handleProfileLoginButtonClick(){
  const email = profileLoginEmail.value.trim()
  const passwordHint = profileLoginPassword.value.trim()

  if(!email || !passwordHint){
    setProfileAuthMessage("Email and password are required to log in.", "error")
    renderProfileState()
    return
  }

  setActionButtonBusy(profileLoginButton, true, "Signing in...")
  try{
    if(!window.HexaPayApi?.login){
      throw new Error("The HexaPay backend client is not ready yet. Please reload the desktop app and try again.")
    }

    const session = await window.HexaPayApi.login(email, passwordHint)
    await window.HexaPayApi.getMemberships?.().catch((error) => {
      console.error("Failed to sync company memberships after login.", error)
    })
    await window.HexaPayApi.getCompany?.().catch((error) => {
      console.error("Failed to sync active company after login.", error)
    })
    setProfileAuthMessage(`Signed in successfully as ${session.currentUser?.displayName || email}.`, "success")
    resetBackendDrivenViewSyncState()
    persistSettings()
    await syncOverviewDataFromBackend({ force: true })
    renderCompanySettings()
    renderCompanyDropdown()
    renderProfileState()
    renderWorkforceSection()
    renderWorktrackSection()
    renderPayrollSection()
    updateDashboardMetrics()
    profileLoginPassword.value = ""
    const isCompanyProfileLogin = isCompanyProfileUser(appState, getCurrentAuthUserFromState(appState), getActiveCompany())
    addActivity("Logged in", isCompanyProfileLogin
      ? `${appSettings.company.name} company profile signed in successfully.`
      : `${session.currentUser?.displayName || appSettings.company.name} signed in with ${normalizeAuthRole(session.currentUser?.role)} access.`)
  } catch (error){
    console.error("Login failed", error)
    setProfileAuthMessage(error?.payload?.error?.details?.[0]?.message || error?.message || "Login failed. Please check your credentials and try again.", "error")
    renderProfileState()
  } finally {
    setActionButtonBusy(profileLoginButton, false)
  }
}

async function handleProfileUserSignupButtonClick(){
  if(!isAuthenticatedFromState(appState) || !userHasRoleAccess(appState, ["Admin"])){
    setProfileAuthMessage("Only admins can create company users.", "error")
    renderProfileState()
    return
  }

  const name = profileUserSignupName?.value.trim() || ""
  const email = profileUserSignupEmail?.value.trim() || ""
  const password = profileUserSignupPassword?.value.trim() || ""
  const repeatPassword = profileUserSignupPasswordRepeat?.value.trim() || ""

  if(!name || !email || !password || !repeatPassword){
    setProfileAuthMessage("Name, email, password, and repeat password are required.", "error")
    renderProfileState()
    return
  }

  if(password !== repeatPassword){
    setProfileAuthMessage("Passwords do not match.", "error")
    renderProfileState()
    return
  }

  if(!isStrongPassword(password)){
    setProfileAuthMessage(getPasswordRequirementMessage(), "error")
    renderProfileState()
    return
  }

  setActionButtonBusy(profileUserSignupButton, true, "Creating...")
  try{
    const createdMember = await window.HexaPayApi.createMembership({
      email,
      display_name: name,
      password,
      role: "VIEWER"
    })
    const assignedRole = createdMember?.role || "Viewer"
    if(profileUserSignupName) profileUserSignupName.value = ""
    if(profileUserSignupPassword) profileUserSignupPassword.value = ""
    if(profileUserSignupPasswordRepeat) profileUserSignupPasswordRepeat.value = ""
    if(profileUserLoginEmail) profileUserLoginEmail.value = email
    setProfileAuthMessage(`${name} was added to this company as ${assignedRole}.`, "success")
    persistSettings()
    renderMembers()
    renderProfileState()
    addActivity("Company user added", `${name} was created under this company as ${assignedRole}.`)
  } catch (error){
    console.error("Failed to create company user.", error)
    setProfileAuthMessage(error?.payload?.error?.details?.[0]?.message || error?.payload?.error?.message || error?.message || "User sign up failed.", "error")
    renderProfileState()
  } finally {
    setActionButtonBusy(profileUserSignupButton, false)
  }
}

async function handleProfileUserLoginButtonClick(){
  const email = profileUserLoginEmail?.value.trim() || ""
  const password = profileUserLoginPassword?.value.trim() || ""

  if(!email || !password){
    setProfileAuthMessage("User email and password are required to log in.", "error")
    renderProfileState()
    return
  }

  setActionButtonBusy(profileUserLoginButton, true, "Signing in...")
  try{
    if(!window.HexaPayApi?.login){
      throw new Error("The HexaPay backend client is not ready yet. Please reload the desktop app and try again.")
    }

    const session = await window.HexaPayApi.login(email, password)
    await window.HexaPayApi.getMemberships?.().catch((error) => {
      console.error("Failed to sync company memberships after user login.", error)
    })
    await window.HexaPayApi.getCompany?.().catch((error) => {
      console.error("Failed to sync active company after user login.", error)
    })
    setProfileAuthMessage(`Signed in successfully as ${session.currentUser?.displayName || email}.`, "success")
    resetBackendDrivenViewSyncState()
    persistSettings()
    await syncOverviewDataFromBackend({ force: true })
    renderCompanySettings()
    renderCompanyDropdown()
    renderProfileState()
    renderWorkforceSection()
    renderWorktrackSection()
    renderPayrollSection()
    updateDashboardMetrics()
    if(profileUserLoginPassword){
      profileUserLoginPassword.value = ""
    }
    addActivity("User logged in", `${session.currentUser?.displayName || appSettings.company.name} signed in with ${normalizeAuthRole(session.currentUser?.role)} access.`)
  } catch (error){
    console.error("User login failed", error)
    setProfileAuthMessage(error?.payload?.error?.details?.[0]?.message || error?.message || "User login failed. Please check the credentials and try again.", "error")
    renderProfileState()
  } finally {
    setActionButtonBusy(profileUserLoginButton, false)
  }
}

if(overviewWorkforceFilter){
overviewWorkforceFilter.addEventListener("change", () => {
  overviewWorkforceMode = overviewWorkforceFilter.value || "department"
  renderOverviewCharts()
})
}

if(overviewPayrollRange){
overviewPayrollRange.addEventListener("change", () => {
  const selectedRange = Number(overviewPayrollRange.value || 6)
  overviewPayrollRangeMonths = [3, 6, 12].includes(selectedRange) ? selectedRange : 6
  renderOverviewCharts()
})
}

if(pendingPayrollType){
pendingPayrollType.addEventListener("change", () => {
  overviewPendingPayrollType = normalizePayrollSalaryTypeLabel(pendingPayrollType.value)
  updateDashboardMetrics()
})
}

if(backupDataButton){
backupDataButton.addEventListener("click", async () => {
  if(!hasLiveBackendSession() || !window.HexaPayApi?.createBackup){
    alert("Sign in to the live backend before generating a backup.")
    return
  }

  setActionButtonBusy(backupDataButton, true, "Creating backup...")
  try{
    const result = await window.HexaPayApi.createBackup()
    addActivity("Backup created", `${result.fileName || "Company backup"} was generated and downloaded from the backend.`)
  } catch (error){
    console.error("Backup generation failed.", error)
    alert(error?.payload?.error?.message || error?.message || "Backup generation failed.")
  } finally {
    setActionButtonBusy(backupDataButton, false)
  }
  })
  }

  async function refreshViewAfterBackupRestore(){
    await window.HexaPayApi.getMemberships?.().catch((error) => {
      console.error("Failed to refresh memberships after restore.", error)
    })
    await window.HexaPayApi.getCompany?.().catch((error) => {
      console.error("Failed to refresh company profile after restore.", error)
    })
    resetBackendDrivenViewSyncState()
    persistSettings()
    await syncOverviewDataFromBackend({ force: true })
    renderCompanySettings()
    renderCompanyDropdown()
    renderProfileState()
    renderWorkforceSection()
    renderWorktrackSection()
    renderPayrollSection()
    renderFinancialsSection()
    updateDashboardMetrics()
  }

  async function handleBackupRestoreFile(file){
    if(!hasLiveBackendSession() || !window.HexaPayApi?.restoreBackup){
      alert("Sign in to the live backend before restoring a backup.")
      return
    }

    if(!file){
      return
    }

    let parsedBackup
    try{
      parsedBackup = JSON.parse(await file.text())
    } catch (error){
      console.error("Failed to parse backup file.", error)
      alert("The selected backup file could not be read. Choose a valid .hexa backup and try again.")
      return
    }

    const confirmedRestore = window.confirm(
      "Restore this backup for the current company? HexaPay will create a rollback snapshot first, then replace the current company data."
    )
    if(!confirmedRestore){
      return
    }

    setActionButtonBusy(restoreBackupButton, true, "Restoring backup...")
    try{
      const result = await window.HexaPayApi.restoreBackup(parsedBackup)
      await refreshViewAfterBackupRestore()
      addActivity(
        "Backup restored",
        `${result?.company?.name || "Company"} was restored from backup. Rollback snapshot: ${result?.rollback_backup?.file_name || "created"}.`
      )
      showNotificationPopup(
        "Backup Restored",
        `${result?.company?.name || "Company data"} was restored successfully. A rollback backup was created automatically.`
      )
    } catch (error){
      console.error("Backup restore failed.", error)
      alert(error?.payload?.error?.message || error?.message || "Backup restore failed.")
    } finally {
      setActionButtonBusy(restoreBackupButton, false)
      if(restoreBackupInput){
        restoreBackupInput.value = ""
      }
    }
  }

  if(restoreBackupButton && restoreBackupInput){
  restoreBackupButton.addEventListener("click", () => {
    if(!hasLiveBackendSession()){
      alert("Sign in to the live backend before restoring a backup.")
      return
    }

    restoreBackupInput.click()
  })

  restoreBackupInput.addEventListener("change", async () => {
    const selectedFile = restoreBackupInput.files?.[0] || null
    await handleBackupRestoreFile(selectedFile)
  })
  }

  async function handleEmployeeExport(button){
    if(!hasLiveBackendSession() || !window.HexaPayApi?.exportEmployees){
      alert("Sign in to the live backend before exporting employee data.")
      return
    }

  setActionButtonBusy(button, true, "Exporting...")
    try{
      const result = await window.HexaPayApi.exportEmployees()
      addActivity("Employee data exported", `${result.fileName || "Employee export"} was downloaded from the backend.`)
    } catch (error){
      console.error("Employee export failed.", error)
      alert(error?.payload?.error?.message || error?.message || "Employee export failed.")
    } finally {
    setActionButtonBusy(button, false)
    }
  }

  if(exportEmployeeDataButton){
  exportEmployeeDataButton.addEventListener("click", async () => {
    await handleEmployeeExport(exportEmployeeDataButton)
  })
  }

  if(employeeToolbarExportButton){
  employeeToolbarExportButton.addEventListener("click", async () => {
    await handleEmployeeExport(employeeToolbarExportButton)
    })
  }

  async function handleContractExport(button){
    if(!hasLiveBackendSession() || !window.HexaPayApi?.exportContracts){
      alert("Sign in to the live backend before exporting contracts.")
      return
    }

    setActionButtonBusy(button, true, "Exporting...")
    try{
      const result = await window.HexaPayApi.exportContracts()
      addActivity("Contract data exported", `${result.fileName || "Contract export"} was downloaded from the backend.`)
    } catch (error){
      console.error("Contract export failed.", error)
      alert(error?.payload?.error?.message || error?.message || "Contract export failed.")
    } finally {
      setActionButtonBusy(button, false)
    }
  }

  if(contractExportButton){
  contractExportButton.addEventListener("click", async () => {
    await handleContractExport(contractExportButton)
    })
  }

  async function handleDepartmentExport(button){
    if(!hasLiveBackendSession() || !window.HexaPayApi?.exportDepartment){
      alert("Sign in to the live backend before exporting a department.")
      return
    }

    if(!selectedDepartmentId){
      alert("Select a department first.")
      return
    }

    setActionButtonBusy(button, true, "Exporting...")
    try{
      const result = await window.HexaPayApi.exportDepartment(selectedDepartmentId)
      const departmentName = getDepartmentById(selectedDepartmentId)?.name || "Department"
      addActivity("Department exported", `${departmentName} was downloaded from the backend.`)
      return result
    } catch (error){
      console.error("Department export failed.", error)
      alert(error?.payload?.error?.message || error?.message || "Department export failed.")
    } finally {
      setActionButtonBusy(button, false)
    }
  }

  if(printDepartmentButton){
  printDepartmentButton.addEventListener("click", async () => {
    await handleDepartmentExport(printDepartmentButton)
    })
  }
