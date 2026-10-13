/* Exact minimum-weight lookup for a d=3 rotated surface code's X-error sector.
 * Ideal Z measurements only; no measurement noise or repeated time rounds.
 * The returned logical check uses the simulator's injected error as ground
 * truth. A real decoder does NOT have access to that ground truth.
 */
(function (root) {
  'use strict';
  const zChecks = [
    { row: -1, col: 1, qubits: [1, 2], label: 'Z₁' },
    { row: 0, col: 0, qubits: [0, 1, 3, 4], label: 'Z₂' },
    { row: 1, col: 1, qubits: [4, 5, 7, 8], label: 'Z₃' },
    { row: 2, col: 0, qubits: [6, 7], label: 'Z₄' }
  ];
  const xChecks = [
    { row: 0, col: -1, qubits: [0, 3], label: 'X₁' },
    { row: 0, col: 1, qubits: [1, 2, 4, 5], label: 'X₂' },
    { row: 1, col: 0, qubits: [3, 4, 6, 7], label: 'X₃' },
    { row: 1, col: 2, qubits: [5, 8], label: 'X₄' }
  ];
  const checkMasks = zChecks.map(c => c.qubits.reduce((mask, q) => mask | (1 << q), 0));
  const bitCount = n => { let count = 0; for (let x = n; x; x &= x - 1) count++; return count; };
  const parity = n => bitCount(n) % 2;
  const syndrome = errors => checkMasks.reduce((s, mask, k) => s | (parity(errors & mask) << k), 0);
  const lookup = Array(16).fill(null);
  for (let pattern = 0; pattern < 512; pattern++) {
    const s = syndrome(pattern);
    if (lookup[s] === null || bitCount(pattern) < bitCount(lookup[s])) lookup[s] = pattern;
  }
  const logicalZ = (1 << 0) | (1 << 3) | (1 << 6);
  function evaluate(errors) {
    if (!Number.isInteger(errors) || errors < 0 || errors > 511) throw new RangeError('Expected a nine-qubit error mask.');
    const s = syndrome(errors), correction = lookup[s], residual = errors ^ correction;
    return { errors, syndrome: s, correction, residual, syndromeCleared: syndrome(residual) === 0,
      logicalFlip: parity(residual & logicalZ) === 1, errorCount: bitCount(errors), correctionCount: bitCount(correction), defectCount: bitCount(s) };
  }
  const model = { zChecks, xChecks, checkMasks, lookup, syndrome, evaluate, bitCount, parity };
  if (typeof module !== 'undefined' && module.exports) module.exports = model;
  else root.QECModel = model;
})(typeof globalThis !== 'undefined' ? globalThis : this);
