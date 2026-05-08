const test = require("node:test")
const assert = require("node:assert/strict")

const { calculatePAYE } = require("./paye")

test("PAYE stays at zero below KES 24,000 after relief", () => {
  assert.equal(calculatePAYE(20000), 0)
})

test("PAYE is zero at exactly KES 24,000", () => {
  assert.equal(calculatePAYE(24000), 0)
})

test("PAYE applies the 25% band between KES 24,001 and KES 32,333", () => {
  assert.equal(calculatePAYE(25000), 250)
})

test("PAYE is correct at exactly KES 32,333", () => {
  assert.equal(calculatePAYE(32333), 2083.25)
})

test("PAYE applies the 30% band between KES 32,334 and KES 500,000", () => {
  assert.equal(calculatePAYE(40000), 4383.35)
})

test("PAYE applies the 32.5% band above KES 500,000", () => {
  assert.equal(calculatePAYE(650000), 191133.35)
})

test("PAYE applies the 35% band above KES 800,000", () => {
  assert.equal(calculatePAYE(900000), 274883.35)
})

test("personal relief reduces tax before the final PAYE amount is returned", () => {
  assert.equal(calculatePAYE(24001), 0.25)
})

test("PAYE never returns a negative value", () => {
  assert.equal(calculatePAYE(1000, { personalRelief: 10000 }), 0)
})
