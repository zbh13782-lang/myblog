window.stellar = window.stellar || {};

stellar.initYuiPet = function () {
  const root = document.getElementById('yui-pet');
  if (!root || root.dataset.ready === 'true') {
    return;
  }

  const button = document.getElementById('yui-pet-button');
  const text = document.getElementById('yui-pet-text');
  const bubble = document.getElementById('yui-pet-bubble');
  const avatar = root.querySelector('.yui-pet__face');
  const pupils = root.querySelectorAll('.yui-pet__pupil');
  const lines = {
    idle: '嘿，先别急着划走嘛～',
    hover: [
      '要一起听会儿吉他吗？',
      '今天也要元气满满地写点东西！',
      '右下角的小唯，申请陪你一起看博客。'
    ],
    click: [
      '认真读完的话，我会偷偷开心一下。',
      '灵感来了的话，记得马上记下来哦。',
      '摸鱼五分钟，然后继续加油。'
    ]
  };

  let hoverIndex = 0;
  let clickIndex = 0;

  const setText = (value) => {
    if (text) {
      text.textContent = value;
    }
  };

  let rafId = 0;

  const setEyeOffset = (x, y) => {
    pupils.forEach((pupil) => {
      pupil.style.transform = `translate(${x}px, ${y}px)`;
    });
  };

  const resetEyes = () => {
    setEyeOffset(0, 0);
  };

  const updateEyes = (clientX, clientY) => {
    if (!avatar || pupils.length === 0) {
      return;
    }
    const rect = avatar.getBoundingClientRect();
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.42;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.hypot(dx, dy) || 1;
    const maxOffset = 4;
    const ratio = Math.min(distance / 140, 1);
    const offsetX = (dx / distance) * maxOffset * ratio;
    const offsetY = (dy / distance) * maxOffset * ratio;
    setEyeOffset(offsetX, offsetY);
  };

  const trackEyes = (event) => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
    rafId = window.requestAnimationFrame(() => {
      updateEyes(event.clientX, event.clientY);
    });
  };

  const openBubble = () => {
    root.classList.add('is-awake');
    if (button) {
      button.setAttribute('aria-expanded', 'true');
    }
  };

  const closeBubble = () => {
    root.classList.remove('is-awake');
    if (button) {
      button.setAttribute('aria-expanded', 'false');
    }
    setText(lines.idle);
  };

  button?.addEventListener('mouseenter', () => {
    openBubble();
    setText(lines.hover[hoverIndex % lines.hover.length]);
    hoverIndex += 1;
  });

  button?.addEventListener('focus', () => {
    openBubble();
    setText(lines.hover[hoverIndex % lines.hover.length]);
    hoverIndex += 1;
  });

  button?.addEventListener('click', () => {
    openBubble();
    setText(lines.click[clickIndex % lines.click.length]);
    clickIndex += 1;
  });

  root.addEventListener('mouseleave', () => {
    window.setTimeout(() => {
      if (!root.matches(':hover') && document.activeElement !== button) {
        closeBubble();
      }
    }, 120);
  });

  button?.addEventListener('blur', () => {
    window.setTimeout(() => {
      if (!root.matches(':hover')) {
        closeBubble();
      }
    }, 120);
  });

  bubble?.addEventListener('click', () => {
    openBubble();
    setText(lines.click[clickIndex % lines.click.length]);
    clickIndex += 1;
  });

  window.addEventListener('mousemove', trackEyes, { passive: true });
  window.addEventListener('mouseleave', resetEyes);

  root.dataset.ready = 'true';
};
