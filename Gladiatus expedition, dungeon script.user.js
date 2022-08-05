// ==UserScript==
// @name         Gladiatus expedition, dungeon script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Expedition, dungeon on colddown
// @author       Marek Straka
// @match        https://*.gladiatus.gameforge.com/*
// @grant        none
// @run-at       document-start

// ==/UserScript==


(function () {
    'use strict';
    const ENEMY_NUMBER = 4;
    const EXPEDITION_NUMBER = 7;
    const ENABLE_EXPEDITIONS = true;

    const HP_THRESHOLD = 40; // %

    const ENABLE_EVENT = false;
    const EVENT_ENEMY = 4;

    setInterval(main, 3000);


    function main() {
      const d = document;
      var query = new URLSearchParams(window.location.search);
      //console.log(query.get('submod'));
      /*for (const key of query.keys()) {
          console.log(key);
      }*/
        /*for (const [key, value] of query.entries()) {
            console.log(`${key}, ${value}`);
        }*/

      // VIEW
      const mod = query.get('mod');
      const submod = query.get('submod');
      const isDashboard = mod === 'overview';
      const isExpeditionView = mod === 'location';
      const isDungeonView = mod === 'dungeon';
      const isReportsView = mod === 'reports';

      //console.log(mod, submod, isDashboard, isDungeonView, isReportsView, isArenaView, isEventView);

      // STATUS
      const hp = parseInt(d.getElementById('header_values_hp_percent').innerText);
      const expeditionReady = d.querySelectorAll('#cooldown_bar_expedition .cooldown_bar_fill_ready')[0];
      const dungeonReady = d.querySelectorAll('#cooldown_bar_dungeon .cooldown_bar_fill_ready')[0];
      const turmaReady = d.querySelectorAll('#cooldown_bar_ct .cooldown_bar_fill_ready')[0];

      // expedition battle
      if (hp > HP_THRESHOLD && expeditionReady) {
        sendRequest(
          'get',
          'ajax.php',
          `mod=location&submod=attack&location=${EXPEDITION_NUMBER}&stage=${ENEMY_NUMBER}&premium=0`,
          null);
      }

      if (dungeonReady) {
          if (!isDungeonView) {
              var dungBtn = d.querySelectorAll('#cooldown_bar_dungeon .cooldown_bar_link');
              console.log(dungBtn);
              dungBtn[0].click();
          }

          const enemies = d.getElementById('content').getElementsByTagName('img');

          // start dungeon
          if (enemies.length === 0) {
              const dungeonBtns = d.getElementById('content').getElementsByTagName('input');

              if(!dungeonBtns[1] || dungeonBtns[1].disabled) {
                  dungeonBtns[0].click();
              } else {
                  dungeonBtns[1].click();
              }

          }
          //dungeon battle
          else {
              for (let i = 0; i < enemies.length; i++) {
                  if (enemies[i].onclick) {
                      enemies[i].click();
                      break;
                  }
              }
          }
      }
    }
  }
)();