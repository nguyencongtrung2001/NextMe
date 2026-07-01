// State Variables
    let challenges = [];
    let logs = {};
    let activeChallengeId = null;
    let selectedDetailMood = "Cực sung";
    let tempMediaMap = {}; // challengeId -> array of {type, url}

    // CSS Confetti Trigger
    const triggerPetals = () => {
      const container = document.createElement('div');
      container.className = 'petal-container';
      document.body.appendChild(container);
      
      const petalColors = ['#E8833D', '#F4A85E', '#7C9F80', '#E58C7C', '#FCD8C0'];
      
      for(let i = 0; i < 35; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        const left = Math.random() * 100;
        const color = petalColors[Math.floor(Math.random() * petalColors.length)];
        const animDuration = 2 + Math.random() * 3; // 2s - 5s
        const animDelay = Math.random() * 1.5;
        
        petal.style.left = left + 'vw';
        petal.style.backgroundColor = color;
        petal.style.animationDuration = animDuration + 's';
        petal.style.animationDelay = animDelay + 's';
        
        container.appendChild(petal);
      }
      
      setTimeout(() => {
        container.remove();
      }, 6000);
    };

    // Mood lists
    const MOOD_LIST = [
      { emoji: "🔥", label: "Cực sung", dataMood: "sung" },
      { emoji: "✨", label: "Tuyệt vời", dataMood: "tot" },
      { emoji: "🌱", label: "Bình thường", dataMood: "binhthuong" },
      { emoji: "🌧️", label: "Hơi mệt", dataMood: "met" },
      { emoji: "🥀", label: "Rất mệt", dataMood: "ratmet" }
    ];

    // Preview selected media
    const previewMedia = (challengeId, input) => {
      const files = Array.from(input.files);
      const previewContainer = document.getElementById(`preview-${challengeId}`);
      if (!previewContainer) return;
      previewContainer.innerHTML = '';
      
      tempMediaMap[challengeId] = [];
      
      files.forEach(file => {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        tempMediaMap[challengeId].push({ type, url });
        
        const mediaWrapper = document.createElement('div');
        mediaWrapper.style.position = 'relative';
        mediaWrapper.style.width = '60px';
        mediaWrapper.style.height = '60px';
        mediaWrapper.style.borderRadius = '8px';
        mediaWrapper.style.overflow = 'hidden';
        mediaWrapper.style.border = '1px solid var(--border)';
        
        if (type === 'image') {
          mediaWrapper.innerHTML = `<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
          mediaWrapper.innerHTML = `<video src="${url}" style="width: 100%; height: 100%; object-fit: cover;"></video>`;
        }
        previewContainer.appendChild(mediaWrapper);
      });
    };
    window.previewMedia = previewMedia;

    // Seed Initial Mock Data if localStorage is empty
    const seedMockData = () => {
      if (!localStorage.getItem('challenges_data')) {
        const mockChallenges = [
          {
            id: "c1",
            title: "Dậy sớm lúc 5:30 AM mỗi ngày",
            status: "active",
            totalDays: 66,
            completedDaysCount: 23,
            streak: 23,
            progress: 35,
            startDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
            estimatedEndDate: new Date(Date.now() + 43 * 24 * 60 * 60 * 1000).toISOString(),
            flower: {
              name: "Hướng Dương",
              type: "sunflower",
              color: "var(--amber)",
              emoji: "🌻"
            }
          },
          {
            id: "c2",
            title: "Đọc 10 trang sách",
            status: "completed",
            totalDays: 30,
            completedDaysCount: 30,
            streak: 30,
            progress: 100,
            startDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
            estimatedEndDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            flower: {
              name: "Tulip",
              type: "tulip",
              color: "var(--rose)",
              emoji: "🌷"
            }
          },
          {
            id: "c3",
            title: "Luyện tập Yoga 15 phút",
            status: "active",
            totalDays: 30,
            completedDaysCount: 9,
            streak: 9,
            progress: 30,
            startDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            estimatedEndDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            flower: {
              name: "Tulip",
              type: "tulip",
              color: "var(--rose)",
              emoji: "🌷"
            }
          }
        ];
        localStorage.setItem('challenges_data', JSON.stringify(mockChallenges));
      }

      if (!localStorage.getItem('challenges_logs')) {
        // c1 mock logs for day 1 to 23
        const c1Logs = Array.from({ length: 23 }, (_, i) => ({
          id: `log-c1-${i + 1}`,
          day: i + 1,
          date: new Date(Date.now() - (23 - i) * 24 * 60 * 60 * 1000).toISOString(),
          mood: "🔥 Cực sung",
          note: `Tôi đã dậy sớm và hoàn thành tốt ngày thứ ${i + 1} của mình!`,
          media: []
        }));

        // c3 mock logs for day 1 to 9 (not completed day 10 today)
        const c3Logs = Array.from({ length: 9 }, (_, i) => ({
          id: `log-c3-${i + 1}`,
          day: i + 1,
          date: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toISOString(),
          mood: "✨ Tuyệt vời",
          note: `Hôm nay luyện tập Yoga ngày thứ ${i + 1} thật sảng khoái và thư thái.`,
          media: []
        }));

        const mockLogs = {
          c1: c1Logs,
          c3: c3Logs
        };
        localStorage.setItem('challenges_logs', JSON.stringify(mockLogs));
      }
    };

    // Load state from localStorage
    const loadState = () => {
      challenges = JSON.parse(localStorage.getItem('challenges_data') || '[]');
      logs = JSON.parse(localStorage.getItem('challenges_logs') || '{}');
    };

    // Save state to localStorage
    const saveState = () => {
      localStorage.setItem('challenges_data', JSON.stringify(challenges));
      localStorage.setItem('challenges_logs', JSON.stringify(logs));
    };

    // Helper: calcCurrentDay (1-based, capped at totalDays)
    const calcCurrentDay = (startDateStr, totalDays) => {
      const start = new Date(startDateStr);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.min(diffDays + 1, totalDays);
    };

    // Helper: format ISO date to dd/MM/yyyy
    const formatDate = (isoString) => {
      if (!isoString) return '';
      const date = new Date(isoString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // MPA Initializer
    const initPage = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('danhsachthuthach.html')) {
        renderChallenges();
      } else if (path.includes('homnay.html')) {
        renderToday();
      } else if (path.includes('thuthacchitiet.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        activeChallengeId = id;
        renderDetail(id);
      }
    };

    // Render Challenges View
    const renderChallenges = () => {
      const grid = document.getElementById('challenges-grid');
      grid.innerHTML = '';

      if (challenges.length === 0) {
        grid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 3rem;">Không có thử thách nào. Hãy tạo mới một thử thách!</p>';
        return;
      }

      challenges.forEach(c => {
        const flowerClass = `flower-${c.flower.type}`;
        const card = document.createElement('article');
        card.className = 'card';
        card.style.cursor = 'pointer';
        card.onclick = () => window.location.href = `thuthacchitiet.html?id=${c.id}`;

        const isCompleted = c.status === 'completed';
        const badgeClass = isCompleted ? 'badge-sage' : 'badge-primary';
        const badgeText = isCompleted ? 'Đã hoàn thành' : 'Đang chạy';

        const streakEmoji = c.streak >= 7 ? '🔥 ' : (c.streak <= 2 ? '🌱 ' : '');
        card.innerHTML = `
          <div style="display: flex; align-items: start; gap: 0.75rem;">
            <div class="flower-icon ${flowerClass}">${c.flower.emoji}</div>
            <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.25rem;">
              <span class="badge ${badgeClass}">${badgeText}</span>
              <h3 style="font-size: 1rem; line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${streakEmoji}${c.title}
              </h3>
              <div class="text-muted" style="font-size: 0.6875rem;">
                Bắt đầu: ${formatDate(c.startDate)} - Hạn: ${formatDate(c.estimatedEndDate)}
              </div>
            </div>
          </div>

      


          <div style="border-top: 1px solid var(--surface-3); padding-top: 0.75rem; font-size: 0.6875rem; font-weight: 700; color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.25rem;">
            <span>Loài hoa:</span>
            <span class="text-primary-color">${c.flower.name}</span>
          </div>
        `;
        grid.appendChild(card);
      });
    };

    // Render Today View
    const renderToday = () => {
      const todayDateString = document.getElementById('today-date-string');
      // Format Vietnamese date
      const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
      const date = new Date();
      todayDateString.innerText = `${days[date.getDay()]}, ngày ${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;

      const listContainer = document.getElementById('today-challenges-list');
      listContainer.innerHTML = '';

      const activeChallenges = challenges.filter(c => c.status === 'active');
      
      // Update overall stats
      const totalActive = activeChallenges.length;
      let completedCount = 0;

      activeChallenges.forEach(c => {
        const currentDay = calcCurrentDay(c.startDate, c.totalDays);
        const challengeLogs = logs[c.id] || [];
        const hasLogToday = challengeLogs.some(l => l.day === currentDay);
        if (hasLogToday) completedCount++;
      });

      const completionPct = totalActive > 0 ? Math.round((completedCount / totalActive) * 100) : 0;
      document.getElementById('today-summary-desc').innerHTML = `Đã hoàn thành <strong class="text-primary-color">${completedCount}</strong> trên <strong style="color: var(--ink);">${totalActive}</strong> thử thách của hôm nay.`;
      document.getElementById('today-completion-pct').innerText = `${completionPct}%`;
      document.getElementById('today-summary-bar').style.width = `${completionPct}%`;

      if (totalActive === 0) {
        listContainer.innerHTML = '<div class="text-muted" style="text-align: center; padding: 2.5rem; border: 1px dashed var(--border); border-radius: var(--radius-lg); background-color: var(--surface);">Không có thử thách nào đang hoạt động hôm nay. Hãy tạo mới ở trang Thử thách!</div>';
        return;
      }

      activeChallenges.forEach(c => {
        const currentDay = calcCurrentDay(c.startDate, c.totalDays);
        const challengeLogs = logs[c.id] || [];
        const todayLog = challengeLogs.find(l => l.day === currentDay);
        const completed = !!todayLog;

        const card = document.createElement('article');
        
        const streakEmoji = c.streak >= 7 ? '🔥 ' : (c.streak <= 2 ? '🌱 ' : '');
        
        if (!completed) {
          card.className = `today-card premium-pending`;
          card.style.cursor = 'pointer';
          card.onclick = () => window.location.href = `thuthacchitiet.html?id=${c.id}`;

          card.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span class="badge badge-surface">Ngày ${currentDay} / ${c.totalDays}</span>
                <span class="badge badge-primary">Chưa hoàn thành</span>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 1.125rem; margin-top: 0.25rem;">${streakEmoji}${c.title}</h4>
              <div style="font-size: 0.75rem; color: var(--primary); text-align: right; font-weight: 600; margin-top: 0.5rem; transition: transform 200ms;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='translateX(0)'">
                Ghi nhật ký ngay →
              </div>
            </div>
          `;
        } else {
          card.className = `today-card premium-completed`;
          card.style.cursor = 'pointer';
          card.onclick = () => window.location.href = `thuthacchitiet.html?id=${c.id}`;

          let mediaHtml = '';
          if (todayLog.media && todayLog.media.length > 0) {
            mediaHtml = `<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">`;
            todayLog.media.forEach(m => {
              if (m.type === 'image') {
                mediaHtml += `<a href="${m.url}" target="_blank"><img src="${m.url}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 10px; border: 1px solid var(--border); box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: transform 150ms;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"></a>`;
              } else {
                mediaHtml += `<video src="${m.url}" controls style="width: 90px; height: 60px; object-fit: cover; border-radius: 10px; border: 1px solid var(--border); box-shadow: 0 2px 8px rgba(0,0,0,0.05);"></video>`;
              }
            });
            mediaHtml += `</div>`;
          }

          card.innerHTML = `
            <div class="today-card-header">
              <div class="flower-icon flower-${c.flower.type}">${c.flower.emoji}</div>
              <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.25rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                  <span class="badge badge-surface">Ngày ${currentDay} / ${c.totalDays}</span>
                  <span class="badge badge-sage" style="display: inline-flex; align-items: center; gap: 0.25rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> 
                    Đã hoàn thành
                  </span>
                </div>
                <h4 style="font-family: var(--font-serif); font-size: 1.125rem;">${streakEmoji}${c.title}</h4>
              </div>
            </div>

            <div style="border-top: 1px solid var(--surface-3); padding-top: 0.75rem;">
              <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="text-muted">Bạn đã ghi nhận ngày hôm nay</span>
                  <div class="badge badge-sage" style="font-weight: 700; font-size: 0.8125rem; background: var(--surface); padding: 0.375rem 0.75rem; border-radius: 8px;">
                    Cảm xúc: <span style="font-size: 0.95rem; margin-left: 0.25rem;">${todayLog.mood}</span>
                  </div>
                </div>
                <div class="journal-quote">
                  <p>"${todayLog.note || 'Không có ghi chú.'}"</p>
                </div>
                ${mediaHtml}
              </div>
            </div>
          `;
        }

        listContainer.appendChild(card);
      });
    };

    // Store temporary mood selection for today view
    let tempTodayMoods = {};
    const selectTodayMood = (challengeId, mood, btn) => {
      // Toggle active class inside button group
      const btnGroup = btn.parentElement;
      btnGroup.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      tempTodayMoods[challengeId] = mood;
    };

    // Action: Tick completion for Today Page
    const completeTodayChallenge = (challengeId) => {
      const c = challenges.find(item => item.id === challengeId);
      if (!c) return;

      const currentDay = calcCurrentDay(c.startDate, c.totalDays);
      const mood = tempTodayMoods[challengeId] || MOOD_LIST[0].label;
      
      const noteInput = document.getElementById(`note-${challengeId}`);
      const note = noteInput ? noteInput.value.trim() : '';
      const media = tempMediaMap[challengeId] || [];

      const newLog = {
        id: `log-${Date.now()}`,
        day: currentDay,
        date: new Date().toISOString(),
        mood,
        note,
        media
      };

      // Push to logs
      if (!logs[challengeId]) logs[challengeId] = [];
      logs[challengeId].push(newLog);

      // Update challenge properties
      c.completedDaysCount += 1;
      c.streak += 1;
      c.progress = Math.min(Math.round((c.completedDaysCount / c.totalDays) * 100), 100);

      // Save state
      saveState();
      
      // Clear temp states
      delete tempTodayMoods[challengeId];
      delete tempMediaMap[challengeId];

      triggerPetals();
      
      setTimeout(() => {
        alert("Tuyệt vời! Bạn đã tích thành công hôm nay! Tiến độ của bạn đã được cập nhật.");
        // Re-render
        renderToday();
      }, 500);
    };

    // Render Challenge Detail View
    const renderDetail = (id) => {
      const c = challenges.find(item => item.id === id);
      if (!c) {
        window.location.href = 'danhsachthuthach.html';
        return;
      }

      const currentDay = calcCurrentDay(c.startDate, c.totalDays);
      const challengeLogs = logs[c.id] || [];
      const hasLogToday = challengeLogs.some(l => l.day === currentDay);

      // Render banner properties
      const flowerBox = document.getElementById('detail-flower-box');
      flowerBox.className = `flower-icon flower-${c.flower.type}`;
      flowerBox.innerText = c.flower.emoji;

      const badge = document.getElementById('detail-status-badge');
      const isCompleted = c.status === 'completed';
      badge.className = `badge ${isCompleted ? 'badge-sage' : 'badge-primary'}`;
      badge.innerText = isCompleted ? 'Đã hoàn thành' : 'Đang chạy';

      document.getElementById('detail-title').innerText = c.title;
      document.getElementById('detail-date-range').innerHTML = `Bắt đầu: <strong>${formatDate(c.startDate)}</strong> - Kết thúc ước tính: <strong>${formatDate(c.estimatedEndDate)}</strong>`;

      const streakBox = document.getElementById('detail-streak-box');
      streakBox.innerHTML = `
        <div class="streak-pill" style="font-size: 0.875rem; padding: 0.375rem 1rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
          <span>${c.streak} ngày streak</span>
        </div>
      `;

      // Set progress label
      document.getElementById('detail-overview-pct').innerText = `Tiến độ: ${c.progress}% (${c.completedDaysCount}/${c.totalDays} ngày)`;

      // Render Heatmap
      renderHeatmapGrid(c, currentDay, challengeLogs);

      // Render Inline Logger for today (only if active & today pending)
      const quickLogCard = document.getElementById('detail-quick-log-card');
      if (c.status === 'active' && !hasLogToday) {
        quickLogCard.style.display = 'flex';
        selectedDetailMood = MOOD_LIST[0].label; // reset to first mood

        // Render detail mood buttons group
        const moodBtnGroup = document.getElementById('detail-mood-btn-group');
        moodBtnGroup.innerHTML = MOOD_LIST.map((opt, idx) => {
          const activeClass = idx === 0 ? 'active' : '';
          return `
            <button class="mood-btn ${activeClass}" data-mood="${opt.dataMood}" onclick="selectDetailMood('${opt.label}', this)">
              <span>${opt.emoji}</span><span>${opt.label}</span>
            </button>
          `;
        }).join('');

        // Wire complete button event
        const completeBtn = document.getElementById('btn-detail-complete');
        completeBtn.onclick = () => {
          completeChallengeFromDetail(c.id, currentDay);
        };
      } else {
        quickLogCard.style.display = 'none';
      }

      // Render Timeline logs in History tab
      renderTimeline(challengeLogs);
    };

    // Action: select mood inside detail view
    const selectDetailMood = (mood, btn) => {
      const btnGroup = btn.parentElement;
      btnGroup.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDetailMood = mood;
    };

    // Action: complete today log inside detail view
    const completeChallengeFromDetail = (challengeId, currentDay) => {
      const c = challenges.find(item => item.id === challengeId);
      if (!c) return;

      const noteVal = document.getElementById('detail-note-input').value.trim();
      const media = tempMediaMap['detail-log'] || [];

      const newLog = {
        id: `log-${Date.now()}`,
        day: currentDay,
        date: new Date().toISOString(),
        mood: selectedDetailMood,
        note: noteVal,
        media: media
      };

      if (!logs[challengeId]) logs[challengeId] = [];
      logs[challengeId].push(newLog);

      c.completedDaysCount += 1;
      c.streak += 1;
      c.progress = Math.min(Math.round((c.completedDaysCount / c.totalDays) * 100), 100);

      // Save state
      saveState();
      
      // Clear inputs
      document.getElementById('detail-note-input').value = '';
      const preview = document.getElementById('preview-detail-log');
      if (preview) preview.innerHTML = '';
      delete tempMediaMap['detail-log'];

      triggerPetals();
      const flowerBox = document.getElementById('detail-flower-box');
      if (flowerBox) flowerBox.classList.add('bloom');

      setTimeout(() => {
        alert("Đã ghi nhận nhật ký ngày hôm nay!");
        // Re-render detail
        renderDetail(challengeId);
      }, 500);
    };

    // Render Heatmap grid of cells
    const renderHeatmapGrid = (challenge, currentDay, challengeLogs) => {
      const grid = document.getElementById('heatmap-grid');
      grid.innerHTML = '';

      const totalDays = challenge.totalDays;

      for (let day = 1; day <= totalDays; day++) {
        const log = challengeLogs.find(l => l.day === day);
        const hasLog = !!log;

        // Determine cell status class
        let statusClass = 'status-lock';
        if (day > currentDay) {
          statusClass = 'status-lock';
        } else if (day === currentDay) {
          statusClass = hasLog ? 'status-today-done' : 'status-today-pending';
        } else {
          statusClass = hasLog ? 'status-done' : 'status-missed';
        }

        const cell = document.createElement('div');
        cell.className = `heatmap-cell ${statusClass}`;
        cell.innerText = day;
        
        // Select cell to display detail below it
        cell.onclick = () => {
          // If locked cell, don't show detail or show limited
          document.querySelectorAll('.heatmap-cell').forEach(c => c.classList.remove('selected'));
          cell.classList.add('selected');
          showHeatmapCellDetail(day, currentDay, log);
        };

        // Select current day cell on render by default
        if (day === currentDay) {
          cell.classList.add('selected');
          showHeatmapCellDetail(day, currentDay, log);
        }

        grid.appendChild(cell);
      }
    };

    // Show cell detail in panel
    const showHeatmapCellDetail = (day, currentDay, log) => {
      const panel = document.getElementById('heatmap-detail-panel');
      panel.style.display = 'block';
      panel.className = 'detail-panel';

      if (day > currentDay) {
        panel.innerHTML = `
          <div style="font-weight: 700; font-size: 0.8125rem;">Ngày ${day}</div>
          <p class="text-muted" style="margin-top: 0.25rem;">Ngày này chưa được mở khóa.</p>
        `;
      } else if (log) {
        panel.classList.add('completed');
        
        let mediaHtml = '';
        if (log.media && log.media.length > 0) {
          mediaHtml = `<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">`;
          log.media.forEach(m => {
            if (m.type === 'image') {
              mediaHtml += `<a href="${m.url}" target="_blank"><img src="${m.url}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border);"></a>`;
            } else {
              mediaHtml += `<video src="${m.url}" controls style="width: 80px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border);"></video>`;
            }
          });
          mediaHtml += `</div>`;
        }

        panel.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
            <strong style="font-size: 0.875rem; color: var(--ink);">Ngày ${day}</strong>
            <span class="badge badge-sage" style="background-color: var(--surface);">${log.mood}</span>
          </div>
          <p style="font-size: 0.8125rem; color: var(--ink-2); line-height: 1.5; font-style: italic; white-space: pre-wrap;">"${log.note || 'Không có ghi chú.'}"</p>
          ${mediaHtml}
        `;
      } else {
        panel.classList.add('missed');
        panel.innerHTML = `
          <div style="font-weight: 700; font-size: 0.8125rem; color: var(--rose);">Ngày ${day}</div>
          <p class="text-muted" style="margin-top: 0.25rem; font-size: 0.8125rem;">Không có nhật ký cho ngày này (Đã bỏ lỡ).</p>
        `;
      }
    };

    // Render Timeline logs list
    const renderTimeline = (challengeLogs) => {
      const container = document.getElementById('detail-timeline-container');
      container.innerHTML = '';

      if (challengeLogs.length === 0) {
        container.innerHTML = '<p class="text-muted" style="text-align: center; padding: 2rem;">Chưa có nhật ký hành trình nào được lưu.</p>';
        return;
      }

      // Sort logs descending (newest day first)
      const sortedLogs = [...challengeLogs].sort((a, b) => b.day - a.day);

      sortedLogs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        
        let mediaHtml = '';
        if (log.media && log.media.length > 0) {
          mediaHtml = `<div class="timeline-media-grid" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">`;
          log.media.forEach(m => {
            if (m.type === 'image') {
              mediaHtml += `<a href="${m.url}" target="_blank"><img src="${m.url}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); transition: transform 150ms;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"></a>`;
            } else {
              mediaHtml += `<video src="${m.url}" controls style="width: 120px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border);"></video>`;
            }
          });
          mediaHtml += `</div>`;
        }

        item.innerHTML = `
          <div class="timeline-dot">${log.day}</div>
          <div class="timeline-content">
            <div class="timeline-meta">
              <span class="timeline-day-label">Ngày ${log.day} • ${formatDate(log.date)}</span>
              <span class="timeline-mood-pill">${log.mood}</span>
            </div>
            <p class="timeline-note-text" style="font-size: 0.875rem; color: var(--ink-2); margin-top: 0.5rem; line-height: 1.5; white-space: pre-wrap;">${log.note || 'Không có ghi chú.'}</p>
            ${mediaHtml}
          </div>
        `;
        container.appendChild(item);
      });
    };

    // Handle Log Search Input Filtering
    const handleLogSearch = () => {
      const query = document.getElementById('log-search-input').value.toLowerCase();
      const c = challenges.find(item => item.id === activeChallengeId);
      if (!c) return;

      const challengeLogs = logs[c.id] || [];
      const filtered = challengeLogs.filter(log => 
        log.mood.toLowerCase().includes(query)
      );
      renderTimeline(filtered);
    };

    // Switch between Overview and History tab on Detail view
    const switchDetailTab = (tab) => {
      // Toggle tab triggers active class
      document.querySelectorAll('.tab-trigger').forEach(trigger => {
        trigger.classList.remove('active');
        if (trigger.getAttribute('onclick').includes(tab)) {
          trigger.classList.add('active');
        }
      });

      // Toggle tab contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`tab-${tab}`).classList.add('active');
    };

    // Modal Create Actions
    const openCreateModal = () => {
      document.getElementById('create-modal').classList.add('active');
      document.getElementById('input-title').value = '';
    };

    const closeCreateModal = () => {
      document.getElementById('create-modal').classList.remove('active');
    };

    const closeCreateModalOnOverlay = (e) => {
      if (e.target.id === 'create-modal') closeCreateModal();
    };

    // Action: Create Challenge from Form
    const submitCreateChallenge = () => {
      const title = document.getElementById('input-title').value.trim();
      const totalDays = parseInt(document.getElementById('input-days').value) || 66;
      
      const flowerSelection = document.querySelector('input[name="flower-selection"]:checked').value;
      
      if (!title) {
        alert("Vui lòng nhập tên thử thách!");
        return;
      }

      // Generate flower properties
      let flowerName = "Hướng Dương";
      let flowerEmoji = "🌻";
      let flowerColor = "var(--primary)";

      if (flowerSelection === 'lavender') {
        flowerName = "Hoa Oải Hương";
        flowerEmoji = "🪻";
        flowerColor = "var(--sage)";
      } else if (flowerSelection === 'tulip') {
        flowerName = "Hoa Tulip";
        flowerEmoji = "🌷";
        flowerColor = "var(--rose)";
      }

      const id = `c-${Date.now()}`;
      const newChallenge = {
        id,
        title,
        status: "active",
        totalDays,
        completedDaysCount: 0,
        streak: 0,
        progress: 0,
        startDate: new Date().toISOString(),
        estimatedEndDate: new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000).toISOString(),
        flower: {
          name: flowerName,
          type: flowerSelection,
          color: flowerColor,
          emoji: flowerEmoji
        }
      };

      challenges.unshift(newChallenge);
      saveState();

      closeCreateModal();
      alert("Hạt giống thử thách mới đã được kích hoạt thành công!");

      // Route to challenges
      window.location.href = 'danhsachthuthach.html';
      renderChallenges();
    };

    // On Load Initialization
    window.addEventListener('DOMContentLoaded', () => {
      seedMockData();
      loadState();
      
      initPage();
    });