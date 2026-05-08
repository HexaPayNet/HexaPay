const assert = require("assert/strict");
const mongoose = require("mongoose");

const app = require("../backend/app");
const env = require("../backend/config/env");
const { connectDb } = require("../backend/config/db");
const Company = require("../backend/models/Company");
const CompanyMembership = require("../backend/models/CompanyMembership");
const CompanySetting = require("../backend/models/CompanySetting");
const Contract = require("../backend/models/Contract");
const Department = require("../backend/models/Department");
const Employee = require("../backend/models/Employee");
const ExportJob = require("../backend/models/ExportJob");
const FinancialRule = require("../backend/models/FinancialRule");
const Holiday = require("../backend/models/Holiday");
const LeaveRequest = require("../backend/models/LeaveRequest");
const PayrollItem = require("../backend/models/PayrollItem");
const PayrollRun = require("../backend/models/PayrollRun");
const User = require("../backend/models/User");
const AttendanceLog = require("../backend/models/AttendanceLog");

function formatMonthKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0")
  ].join("-");
}

function formatIsoWeekKey(date = new Date()) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

function formatDateKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => resolve(server));
    server.on("error", reject);
  });
}

function stopServer(server) {
  return new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }

    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function apiRequest(baseUrl, requestPath, { method = "GET", token = "", body } = {}) {
  const response = await fetch(`${baseUrl}${requestPath}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${method} ${requestPath} failed with ${response.status}: ${JSON.stringify(payload)}`);
  }

  return payload;
}

async function cleanupSmokeData(companyId, userId, email) {
  if (companyId) {
    await Promise.all([
      PayrollItem.deleteMany({ companyId }),
      PayrollRun.deleteMany({ companyId }),
      AttendanceLog.deleteMany({ companyId }),
      LeaveRequest.deleteMany({ companyId }),
      Holiday.deleteMany({ companyId }),
      Contract.deleteMany({ companyId }),
      FinancialRule.deleteMany({ companyId }),
      CompanySetting.deleteMany({ companyId }),
      Employee.deleteMany({ companyId }),
      Department.deleteMany({ companyId }),
      ExportJob.deleteMany({ companyId }),
      CompanyMembership.deleteMany({ companyId }),
      Company.deleteOne({ _id: companyId })
    ]);
  }

  if (userId) {
    await User.deleteOne({ _id: userId });
    return;
  }

  if (email) {
    await User.deleteOne({ email });
  }
}

async function runSmoke() {
  const suffix = Date.now();
  const password = "PilotTest1!";
  const registerEmail = `pilot.smoke.${suffix}@example.com`;
  const todayKey = formatDateKey();
  const weekKey = formatIsoWeekKey();
  let smokeCompanyId = "";
  let smokeUserId = "";

  await connectDb();
  const server = await startServer();
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}${env.apiPrefix}`;

  try {
    const registerPayload = await apiRequest(baseUrl, "/auth/register", {
      method: "POST",
      body: {
        email: registerEmail,
        password,
        display_name: "Pilot Smoke Admin",
        company: {
          name: `Pilot Smoke Company ${suffix}`,
          industry: "Manufacturing",
          currency_code: "KES",
          country_code: "KE",
          timezone: "Africa/Nairobi"
        }
      }
    });

    assert.ok(registerPayload.access_token, "Register should return an access token.");
    assert.ok(registerPayload.active_company_id, "Register should return an active company id.");
    smokeCompanyId = registerPayload.active_company_id;
    smokeUserId = registerPayload.user?.id || "";

    await apiRequest(baseUrl, "/auth/logout", {
      method: "POST",
      token: registerPayload.access_token
    });

    const loginPayload = await apiRequest(baseUrl, "/auth/login", {
      method: "POST",
      body: {
        email: registerEmail,
        password
      }
    });

    const token = loginPayload.access_token;
    const companyId = loginPayload.active_company_id;

    const departmentPayload = await apiRequest(baseUrl, `/companies/${companyId}/departments`, {
      method: "POST",
      token,
      body: {
        name: `Pilot Ops ${suffix}`,
        salary_type: "monthly",
        default_salary_amount: 15000,
        default_salary_currency: "KES"
      }
    });

    const departmentId = departmentPayload.department.id;

    const monthlyEmployeePayload = await apiRequest(baseUrl, `/companies/${companyId}/employees`, {
      method: "POST",
      token,
      body: {
        department_id: departmentId,
        full_name: `Monthly Pilot ${suffix}`,
        role_title: "Plant Supervisor",
        employment_type: "full_time",
        payment_type: "monthly",
        employment_date: todayKey,
        salary_amount: 15000,
        salary_currency: "KES",
        status: "active",
        payroll_status: "pending"
      }
    });

    const dailyEmployeePayload = await apiRequest(baseUrl, `/companies/${companyId}/employees`, {
      method: "POST",
      token,
      body: {
        department_id: departmentId,
        full_name: `Daily Pilot ${suffix}`,
        role_title: "Shift Operator",
        employment_type: "casual",
        payment_type: "daily",
        employment_date: todayKey,
        salary_amount: 700,
        salary_currency: "KES",
        status: "active",
        payroll_status: "pending"
      }
    });

    const weeklyEmployeePayload = await apiRequest(baseUrl, `/companies/${companyId}/employees`, {
      method: "POST",
      token,
      body: {
        department_id: departmentId,
        full_name: `Weekly Pilot ${suffix}`,
        role_title: "Machine Operator",
        employment_type: "full_time",
        payment_type: "weekly",
        payment_basis: "attendance_dependent",
        employment_date: todayKey,
        salary_amount: 4900,
        salary_currency: "KES",
        status: "active",
        payroll_status: "pending"
      }
    });

    const attendancePayload = await apiRequest(baseUrl, `/companies/${companyId}/attendance-logs`, {
      method: "POST",
      token,
      body: {
        employee_id: dailyEmployeePayload.employee.id,
        date: todayKey,
        check_in: "08:00",
        check_out: "17:00",
        mode: "manual"
      }
    });

    const approvedAttendance = await apiRequest(baseUrl, `/companies/${companyId}/attendance-logs/${attendancePayload.attendance_log.id}/approve`, {
      method: "POST",
      token
    });

    assert.equal(approvedAttendance.attendance_log.approval_status, "approved", "Attendance should approve successfully.");

    const weeklyAttendancePayload = await apiRequest(baseUrl, `/companies/${companyId}/attendance-logs`, {
      method: "POST",
      token,
      body: {
        employee_id: weeklyEmployeePayload.employee.id,
        date: todayKey,
        check_in: "08:00",
        check_out: "17:00",
        mode: "manual"
      }
    });

    const approvedWeeklyAttendance = await apiRequest(baseUrl, `/companies/${companyId}/attendance-logs/${weeklyAttendancePayload.attendance_log.id}/approve`, {
      method: "POST",
      token
    });

    assert.equal(approvedWeeklyAttendance.attendance_log.approval_status, "approved", "Weekly attendance should approve successfully.");

    const dailyRunPayload = await apiRequest(baseUrl, `/companies/${companyId}/payroll-runs`, {
      method: "POST",
      token,
      body: {
        period: todayKey,
        salary_type: "daily",
        currency_code: "KES"
      }
    });

    const generatedDailyRun = await apiRequest(baseUrl, `/companies/${companyId}/payroll-runs/${dailyRunPayload.payroll_run.id}/generate`, {
      method: "POST",
      token,
      body: {}
    });

    const dailyEmployeeItem = generatedDailyRun.payroll_items.find((item) => item.employee_id === dailyEmployeePayload.employee.id);
    assert.ok(dailyEmployeeItem, "Daily payroll generation should include the daily employee.");
    assert.equal(dailyEmployeeItem.attendance_days, 1, "Daily payroll should count the approved attendance day.");

    const monthlyRunPayload = await apiRequest(baseUrl, `/companies/${companyId}/payroll-runs`, {
      method: "POST",
      token,
      body: {
        period: formatMonthKey(),
        salary_type: "monthly",
        currency_code: "KES"
      }
    });

    const generatedMonthlyRun = await apiRequest(baseUrl, `/companies/${companyId}/payroll-runs/${monthlyRunPayload.payroll_run.id}/generate`, {
      method: "POST",
      token,
      body: {}
    });

    assert.ok(
      generatedMonthlyRun.payroll_items.some((item) => item.employee_id === monthlyEmployeePayload.employee.id),
      "Monthly payroll generation should include the monthly employee."
    );

    const approvedMonthlyRun = await apiRequest(baseUrl, `/companies/${companyId}/payroll-runs/${monthlyRunPayload.payroll_run.id}/approve`, {
      method: "POST",
      token,
      body: {}
    });

    assert.equal(approvedMonthlyRun.payroll_run.status, "approved", "Monthly payroll should approve successfully.");

    const weeklyRunPayload = await apiRequest(baseUrl, `/companies/${companyId}/payroll-runs`, {
      method: "POST",
      token,
      body: {
        period: weekKey,
        salary_type: "weekly",
        currency_code: "KES"
      }
    });

    const generatedWeeklyRun = await apiRequest(baseUrl, `/companies/${companyId}/payroll-runs/${weeklyRunPayload.payroll_run.id}/generate`, {
      method: "POST",
      token,
      body: {}
    });

    const weeklyEmployeeItem = generatedWeeklyRun.payroll_items.find((item) => item.employee_id === weeklyEmployeePayload.employee.id);
    assert.ok(weeklyEmployeeItem, "Weekly payroll generation should include the weekly employee.");
    assert.equal(weeklyEmployeeItem.attendance_days, 1, "Weekly payroll should count the approved attendance day.");
    assert.ok(
      !generatedWeeklyRun.payroll_items.some((item) => item.employee_id === dailyEmployeePayload.employee.id),
      "Weekly payroll should not include daily employees."
    );

    console.log("Pilot smoke checks passed.");
    console.log(`Company: ${companyId}`);
    console.log(`Monthly employee: ${monthlyEmployeePayload.employee.id}`);
    console.log(`Daily employee: ${dailyEmployeePayload.employee.id}`);
    console.log(`Weekly employee: ${weeklyEmployeePayload.employee.id}`);
  } finally {
    await cleanupSmokeData(smokeCompanyId, smokeUserId, registerEmail);
    await stopServer(server);
    await mongoose.disconnect();
  }
}

runSmoke().catch((error) => {
  console.error("Pilot smoke checks failed.", error);
  process.exitCode = 1;
});
