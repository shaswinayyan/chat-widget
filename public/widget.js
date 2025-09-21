;(() => {
  // Get the script tag that loaded this widget
  const scriptTag = document.currentScript || document.querySelector("script[data-botid]")
  const botId = scriptTag ? scriptTag.getAttribute("data-botid") : null

  if (!botId) {
    console.error("ChatBot Widget: No data-botid attribute found")
    return
  }

  // Get the app URL from the script src or use default
  const scriptSrc = scriptTag.src
  const appUrl = scriptSrc.replace("/widget.js", "")

  // Create the chat widget container
  const widgetContainer = document.createElement("div")
  widgetContainer.id = `chatbot-widget-${botId}`
  widgetContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `

  // Create the floating button
  const floatingButton = document.createElement("button")
  floatingButton.style.cssText = `
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #3b82f6;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  `

  floatingButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  `

  // Create the chat iframe (initially hidden)
  const chatIframe = document.createElement("iframe")
  chatIframe.src = `${appUrl}/embed/chat?botId=${botId}`
  chatIframe.style.cssText = `
    width: 350px;
    height: 500px;
    border: none;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    background: white;
    display: none;
    position: absolute;
    bottom: 70px;
    right: 0;
  `

  let isOpen = false

  // Toggle chat window
  floatingButton.addEventListener("click", () => {
    isOpen = !isOpen
    if (isOpen) {
      chatIframe.style.display = "block"
      floatingButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `
    } else {
      chatIframe.style.display = "none"
      floatingButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      `
    }
  })

  // Add hover effects
  floatingButton.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.1)"
  })

  floatingButton.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)"
  })

  // Assemble the widget
  widgetContainer.appendChild(floatingButton)
  widgetContainer.appendChild(chatIframe)

  // Add to page when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.appendChild(widgetContainer)
    })
  } else {
    document.body.appendChild(widgetContainer)
  }

  // Handle responsive positioning
  function updatePosition() {
    if (window.innerWidth < 768) {
      widgetContainer.style.right = "10px"
      widgetContainer.style.bottom = "10px"
      chatIframe.style.width = "320px"
      chatIframe.style.height = "450px"
    } else {
      widgetContainer.style.right = "20px"
      widgetContainer.style.bottom = "20px"
      chatIframe.style.width = "350px"
      chatIframe.style.height = "500px"
    }
  }

  window.addEventListener("resize", updatePosition)
  updatePosition()
})()
