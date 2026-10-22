# Recent Changes in Khidmat Web App

## AI Agent Widget Enhancements (`SiteAgentWidget.tsx`)

1. **Input Field & Mobile Typing Issues:**
   - Fixed the input field functionality to ensure reliable typing and focus behavior on mobile devices.
   - Removed conflicting drag/resize event listeners from the inner components (such as the messages area and input area) by enforcing `cursor-auto`, preventing them from unintentionally hijacking mobile touches or clicks.

2. **Message Submission Reliability:**
   - Ensured the "Enter" key reliably submits user messages. 
   - Added proper `onKeyDown` handling on the input to capture the 'Enter' key and call `e.preventDefault()` to avoid unintended form submissions or page reloads.

3. **Scroll Behavior with Suggestions:**
   - Perfected the `scrollToBottom` behavior when suggestions are selected. 
   - Ensure the scroll smoothly moves to the bottom of the chat window whenever the `messages` array is updated or when the `isTyping` state changes, ensuring new content is always visible.

4. **UI Structure Adjustments:**
   - Separated the chat logic into a reusable `ChatInner` component to guarantee consistent rendering and behavior between the Desktop draggable/resizable window (`react-rnd`) and the Mobile fullscreen wrapper.
   - Prevented drag events on the close button to fix UX issues when trying to close the widget on desktop.
