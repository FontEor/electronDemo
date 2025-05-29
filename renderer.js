const information = document.getElementById("info");
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;
const func = async () => {
  const response = await window.versions.ping();
  console.log(response); // 打印 'pong'
};

func();

console.log(window.myAPI);

const setButton = document.getElementById("btn");
const titleInput = document.getElementById("title");
setButton.addEventListener("click", () => {
  const title = titleInput.value;
  window.electronAPI.setTitle(title);
});

const btn = document.getElementById("btnFile");
const filePathElement = document.getElementById("filePath");
btn.addEventListener("click", async () => {
  console.log("click");
  const filePath = await window.electronAPI.openFile();
  filePathElement.innerText = filePath;
});

window.electronAPI.onUpdateCounter((value) => {
  const oldValue = Number(counter.innerText);
  const newValue = oldValue + value;
  counter.innerText = newValue.toString();
  window.electronAPI.counterValue(newValue);
});
