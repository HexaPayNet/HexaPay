const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const html = fs.readFileSync(path.join(__dirname, "..", "Index.html"), "utf8")

test("PAYE Calculator is rendered above Custom Deductions", () => {
  const payeCalculatorIndex = html.indexOf("<h3>PAYE Calculator</h3>")
  const customDeductionsIndex = html.indexOf("<h3>Custom Deductions</h3>")

  assert.notEqual(payeCalculatorIndex, -1)
  assert.notEqual(customDeductionsIndex, -1)
  assert.ok(payeCalculatorIndex < customDeductionsIndex)
})

test("financial rules view exposes PAYE calculator controls and statutory summaries", () => {
  assert.match(html, /id="payeCalculatorGrossSalary"/)
  assert.match(html, /id="calculatePayeButton"/)
  assert.match(html, /id="financialShifRule"/)
  assert.match(html, /id="financialNssfRule"/)
  assert.match(html, /id="financialHousingLevyRule"/)
})
