export const cls = {
   controls: 'controls',
   count: 'count',
   cBtn: 'c-btn',
   startBtn: 'start-btn',
   strictBtn: 'strict-btn',
   strictIndicator: 'strict-indicator',
   on_ofBtn: 'on-of-btn',
   toggle: 'toggle',
   gameBtn: 'game-btn',
   gameButtons: 'game-buttons',
   btnHvr: 'btn-hvr',
   flash: 'flash'
}

export const UISelectors = {
   controls : `.${cls.controls}`,
   count: `.${cls.count} span`,
   cBtn: `.${cls.cBtn}`,
   startBtn: `.${cls.startBtn}`,
   strictBtn: `.${cls.strictBtn}`,
   strictIndicator: `.${cls.strictIndicator}`,
   on_ofBtn: `.${cls.on_ofBtn}`,
   toggle: `.${cls.on_ofBtn} span`,
   gameButtons: `.${cls.gameButtons}`
}

export const btnId = {
   green: 0,
   red: 1,
   yellow: 2,
   blue: 3
}