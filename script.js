const testButton = document.querySelector("#testButton");
const message = document.querySelector("#message");

testButton.addEventListener("click", () => {
  message.textContent = "버튼을 클릭했습니다!";
});
