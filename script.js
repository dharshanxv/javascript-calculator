const exprEl = document.getElementById('expr');
const resultEl = document.getElementById('result');
const OPS = ['+', '−', '×', '÷'];

let expr = '';
let justEvaluated = false;

function render() {
  exprEl.textContent = '';
  resultEl.textContent = expr || '0';
}

function clearAll() {
  expr = '';
  justEvaluated = false;
  resultEl.classList.remove('error');
  exprEl.textContent = '';
  resultEl.textContent = '0';
}

function del() {
  if (resultEl.classList.contains('error')) return clearAll();
  justEvaluated = false;
  expr = expr.slice(0, -1);
  render();
}

function press(k) {
  if (resultEl.classList.contains('error')) clearAll();

  if (/\d/.test(k)) {
    if (justEvaluated) { expr = ''; justEvaluated = false; }
    expr += k;
  } else if (k === '.') {
    if (justEvaluated) { expr = ''; justEvaluated = false; }
    const lastNum = expr.split(/[+−×÷]/).pop();
    if (lastNum.includes('.')) return;
    expr += lastNum === '' ? '0.' : '.';
  } else if (OPS.includes(k)) {
    if (!expr) return;
    justEvaluated = false;
    if (OPS.includes(expr.slice(-1))) expr = expr.slice(0, -1);
    expr += k;
  }
  render();
}

function evaluate(e) {
  const t = e.match(/\d+\.?\d*|\.\d+|[+−×÷]/g);
  const nums = [parseFloat(t[0])];
  const ops = [];

  for (let i = 1; i < t.length; i += 2) {
    const op = t[i];
    const n = parseFloat(t[i + 1]);
    if (op === '×') nums[nums.length - 1] *= n;
    else if (op === '÷') {
      if (n === 0) return null;
      nums[nums.length - 1] /= n;
    } else {
      ops.push(op);
      nums.push(n);
    }
  }

  let r = nums[0];
  ops.forEach((op, i) => {
    r = op === '+' ? r + nums[i + 1] : r - nums[i + 1];
  });
  return parseFloat(r.toFixed(10));
}

function equals() {
  if (!expr || resultEl.classList.contains('error')) return;
  let e = expr;
  if (OPS.includes(e.slice(-1))) e = e.slice(0, -1);
  if (!e) return;

  const out = evaluate(e);
  exprEl.textContent = e + ' =';

  if (out === null) {
    resultEl.textContent = 'Cannot divide by 0';
    resultEl.classList.add('error');
    expr = '';
  } else {
    expr = String(out);
    resultEl.textContent = expr;
    justEvaluated = true;
  }
}

document.querySelector('.keys').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const k = btn.dataset.key;
  if (k === 'C') clearAll();
  else if (k === 'DEL') del();
  else if (k === '=') equals();
  else press(k);
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  const map = { '*': '×', '/': '÷', '-': '−' };
  const k = map[e.key] || e.key;
  if (/^[0-9.+−×÷]$/.test(k)) press(k);
  else if (k === 'Enter' || k === '=') { e.preventDefault(); equals(); }
  else if (k === 'Backspace') del();
  else if (k === 'Escape') clearAll();
});