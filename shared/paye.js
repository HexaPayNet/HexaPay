(function initHexaPayPaye(root, factory){
  if(typeof module === "object" && module.exports){
    module.exports = factory()
    return
  }

  root.HexaPayPaye = factory()
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  const DEFAULT_PAYE_BANDS = Object.freeze([
    Object.freeze({ upTo: 24000, rate: 0.10 }),
    Object.freeze({ upTo: 32333, rate: 0.25 }),
    Object.freeze({ upTo: 500000, rate: 0.30 }),
    Object.freeze({ upTo: 800000, rate: 0.325 }),
    Object.freeze({ upTo: Infinity, rate: 0.35 })
  ])

  const DEFAULT_PERSONAL_RELIEF = 2400

  function cloneBand(band){
    return {
      upTo: band.upTo,
      rate: band.rate
    }
  }

  function roundCurrency(value){
    return Number(Number(value || 0).toFixed(2))
  }

  function isFinitePositiveNumber(value){
    return Number.isFinite(value) && value >= 0
  }

  function normalizeBand(rawBand, fallbackBand, previousLimit){
    const rawUpTo = Number(rawBand?.upTo)
    const rawRate = Number(rawBand?.rate)
    const fallbackUpTo = fallbackBand.upTo
    const fallbackRate = fallbackBand.rate

    const normalizedUpTo = rawBand?.upTo === Infinity
      ? Infinity
      : (isFinitePositiveNumber(rawUpTo) && rawUpTo > previousLimit ? rawUpTo : fallbackUpTo)
    const normalizedRate = isFinitePositiveNumber(rawRate)
      ? rawRate
      : fallbackRate

    return {
      upTo: normalizedUpTo,
      rate: normalizedRate
    }
  }

  function normalizePayeConfiguration(config = {}){
    const rawBands = Array.isArray(config.payeBands) && config.payeBands.length
      ? config.payeBands
      : DEFAULT_PAYE_BANDS
    let previousLimit = 0

    const payeBands = rawBands.map((band, index) => {
      const normalizedBand = normalizeBand(band, DEFAULT_PAYE_BANDS[index] || DEFAULT_PAYE_BANDS[DEFAULT_PAYE_BANDS.length - 1], previousLimit)
      previousLimit = normalizedBand.upTo
      return normalizedBand
    })

    const hasInfinityBand = payeBands.some((band) => band.upTo === Infinity)
    if(!hasInfinityBand){
      payeBands.push(cloneBand(DEFAULT_PAYE_BANDS[DEFAULT_PAYE_BANDS.length - 1]))
    }

    const personalRelief = isFinitePositiveNumber(Number(config.personalRelief))
      ? Number(config.personalRelief)
      : DEFAULT_PERSONAL_RELIEF

    return {
      payeBands,
      personalRelief
    }
  }

  function serializePayeConfiguration(config = {}){
    const normalizedConfig = normalizePayeConfiguration(config)
    return {
      payeBands: normalizedConfig.payeBands.map((band) => ({
        upTo: band.upTo,
        rate: band.rate
      })),
      personalRelief: normalizedConfig.personalRelief
    }
  }

  function calculatePAYE(taxablePay, config = {}){
    const normalizedConfig = normalizePayeConfiguration(config)
    const taxableAmount = Math.max(0, Number(taxablePay || 0))
    let tax = 0
    let previousLimit = 0

    for(const band of normalizedConfig.payeBands){
      if(taxableAmount <= previousLimit){
        break
      }

      const upperLimit = band.upTo
      const taxableInBand = Math.min(taxableAmount, upperLimit) - previousLimit
      if(taxableInBand > 0){
        tax += taxableInBand * band.rate
      }

      previousLimit = upperLimit
    }

    return roundCurrency(Math.max(0, tax - normalizedConfig.personalRelief))
  }

  return {
    DEFAULT_PAYE_BANDS,
    DEFAULT_PERSONAL_RELIEF,
    DEFAULT_PAYE_CONFIGURATION: Object.freeze({
      payeBands: DEFAULT_PAYE_BANDS.map(cloneBand),
      personalRelief: DEFAULT_PERSONAL_RELIEF
    }),
    normalizePayeConfiguration,
    serializePayeConfiguration,
    calculatePAYE
  }
})
