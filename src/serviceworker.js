export default function serviceworker() {
    let swUrl = `${process.env.PUBLIC_URL}/sw.js`
    navigator.serviceWorker.register(swUrl)
        .then((res) => {
            console.log("res", res);
        })
}


// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register(swUrl).then((reg) => {
//             console.log("Service Worker registered with scope:", reg.scope);
//         })
//             .catch((err) => {
//                 console.error("Service Worker registration failed:", err);
//             })
//     })
// }