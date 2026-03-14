// ============================================
//  STEAL THE LAB — game.js
// ============================================

const state = {
  items: 0,
  level: 1,
  totalStolen: 0,
  timesStolen: 0,

  enemy: {
    items: 20,
    level: 1,
    defense: 0,
    prog: 0,
  },

  prog: 0,         // production progress 0–100
  cooldown: false, // steal cooldown
};

// ---- UI helpers ----
function $(id) { return document.getElementById(id); }

function setNum(id, val) {
  const el = $(id);
  if (!el) return;
  el.textContent = val;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
  setTimeout(() => el.classList.remove('pop'), 120);
}

function log(msg, type = 'info') {
  const box = $('log-box');
  const entry = document.createElement('div');
  entry.className = `log-entry log-${type}`;
  const now = new Date();
  const ts = `[${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}]`;
  entry.textContent = `${ts} ${msg}`;
  box.prepend(entry);
  // Keep log at max 60 entries
  while (box.children.length > 60) box.removeChild(box.lastChild);
}

function updateUI() {
  $('items').textContent       = state.items;
  $('level').textContent       = state.level;
  $('per-tick').textContent    = state.level;
  $('total-stolen').textContent = state.totalStolen;
  $('level-badge').textContent = `LVL ${state.level}`;

  $('enemyItems').textContent  = state.enemy.items;
  $('enemy-level').textContent = state.enemy.level;
  $('enemy-defense').textContent = state.enemy.defense;
  $('times-stolen').textContent = state.timesStolen;

  const upgCost = upgradeCost();
  $('upg-cost').textContent = `[${upgCost} items]`;
  $('upg-btn').disabled = state.items < upgCost;
  $('steal-btn').disabled = state.enemy.items <= 0 || state.cooldown;

  const enemyStatus = $('enemy-status');
  if (state.enemy.items <= 0) {
    enemyStatus.textContent = 'EMPTY';
    enemyStatus.className = 'badge badge-red';
  } else if (state.enemy.defense >= 3) {
    enemyStatus.textContent = 'FORTIFIED';
    enemyStatus.className = 'badge badge-red';
  } else {
    enemyStatus.textContent = 'ACTIVE';
    enemyStatus.className = 'badge badge-red';
  }
}

function upgradeCost() {
  return Math.floor(10 * Math.pow(1.6, state.level - 1));
}

// ---- Production tick ----
const TICK_MS = 100;
const PROD_TICKS = 20; // ticks per item cycle (2 seconds at 100ms)

setInterval(() => {
  // Player production
  state.prog += 1;
  if (state.prog >= PROD_TICKS) {
    state.prog = 0;
    state.items += state.level;
    updateUI();
  }
  const pct = Math.round((state.prog / PROD_TICKS) * 100);
  $('prod-bar').style.width = pct + '%';
  $('prod-pct').textContent = pct + '%';

  // Enemy production
  state.enemy.prog += 1;
  const enemyTicks = PROD_TICKS + state.enemy.level * 2;
  if (state.enemy.prog >= enemyTicks) {
    state.enemy.prog = 0;
    state.enemy.items += state.enemy.level;
    // Enemy occasionally upgrades
    if (state.enemy.items >= upgradeCostEnemy() && Math.random() < 0.15) {
      state.enemy.items -= upgradeCostEnemy();
      state.enemy.level++;
      state.enemy.defense = Math.min(state.enemy.defense + 1, 5);
      log(`Enemy lab upgraded to level ${state.enemy.level}! Defense +1`, 'fail');
      updateUI();
    }
  }
  const ePct = Math.round((state.enemy.prog / enemyTicks) * 100);
  $('enemy-prod-bar').style.width = ePct + '%';
  $('enemy-prod-pct').textContent = ePct + '%';

}, TICK_MS);

function upgradeCostEnemy() {
  return Math.floor(15 * Math.pow(1.6, state.enemy.level - 1));
}

// ---- Player actions ----
function upgrade() {
  const cost = upgradeCost();
  if (state.items < cost) {
    log(`Not enough items to upgrade. Need ${cost}.`, 'fail');
    return;
  }
  state.items -= cost;
  state.level++;
  log(`Lab upgraded to level ${state.level}! Production +${state.level}/cycle`, 'upgrade');
  updateUI();
}

function steal() {
  if (state.enemy.items <= 0) {
    log('Enemy lab is empty. Nothing to steal.', 'info');
    return;
  }
  if (state.cooldown) return;

  // Success chance drops with enemy defense
  const successChance = Math.max(0.3, 0.7 - state.enemy.defense * 0.07);
  const success = Math.random() < successChance;

  if (success) {
    const maxSteal = Math.max(1, Math.floor(state.level * 2.5));
    let stolen = Math.floor(Math.random() * maxSteal) + 1;
    stolen = Math.min(stolen, state.enemy.items);
    state.enemy.items -= stolen;
    state.items += stolen;
    state.totalStolen += stolen;
    state.timesStolen++;
    log(`Raid successful! Stole ${stolen} item${stolen !== 1 ? 's' : ''} from enemy lab.`, 'steal');
  } else {
    // Failed steal — lose some items as penalty
    const penalty = Math.min(state.items, Math.floor(Math.random() * 3) + 1);
    state.items -= penalty;
    log(`Raid failed! Enemy defense caught you. Lost ${penalty} item${penalty !== 1 ? 's' : ''}.`, 'fail');
  }

  updateUI();

  // Cooldown (1.5s)
  state.cooldown = true;
  $('steal-btn').disabled = true;
  setTimeout(() => {
    state.cooldown = false;
    updateUI();
  }, 1500);
}

// ---- Init ----
log('System online. Laboratory initialized.', 'success');
updateUI();
