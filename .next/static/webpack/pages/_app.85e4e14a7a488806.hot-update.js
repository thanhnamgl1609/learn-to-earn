"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/_app",{

/***/ "./components/providers/web3/index.tsx":
/*!*********************************************!*\
  !*** ./components/providers/web3/index.tsx ***!
  \*********************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"useHooks\": function() { return /* binding */ useHooks; },\n/* harmony export */   \"useWeb3\": function() { return /* binding */ useWeb3; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ \"./components/providers/web3/utils.ts\");\n/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ethers */ \"./node_modules/ethers/lib.esm/index.js\");\n\nvar _s = $RefreshSig$(), _s1 = $RefreshSig$(), _s2 = $RefreshSig$();\n\n\n\nconst pageReload = ()=>window.location.reload();\nconst Web3Context = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)((0,_utils__WEBPACK_IMPORTED_MODULE_2__.createDefaultState)());\nconst Web3Provider = (param)=>{\n    let { children  } = param;\n    _s();\n    const [web3Api, setWeb3Api] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)((0,_utils__WEBPACK_IMPORTED_MODULE_2__.createDefaultState)());\n    const handleAccountChange = (ethereum)=>async ()=>{\n            const isLocked = !await ethereum._metamask.isUnlocked();\n            if (isLocked) pageReload();\n        };\n    const setGlobalListeners = (ethereum)=>{\n        ethereum.on(\"chainChanged\", pageReload);\n        ethereum.on(\"accountsChanged\", handleAccountChange(ethereum));\n    };\n    const removeGlobalListeners = (ethereum)=>{\n        ethereum === null || ethereum === void 0 ? void 0 : ethereum.removeListener(\"chainChanged\", pageReload);\n        ethereum === null || ethereum === void 0 ? void 0 : ethereum.removeListener(\"accountsChanged\", handleAccountChange(ethereum));\n    };\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const initWeb3 = async ()=>{\n            try {\n                const ethereum = window.ethereum;\n                const provider = new ethers__WEBPACK_IMPORTED_MODULE_3__.ethers.providers.Web3Provider(ethereum);\n                const nftSchoolContract = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.loadContract)(\"NftSchool\", provider);\n                const nftCertificatesContract = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.loadContract)(\"NftCertificates\", provider);\n                const [nftIdentities, nftSchool, nftCertificates] = await Promise.all([\n                    loadSignedContract(\"NftIdentities\", provider),\n                    loadSignedContract(\"NftSchool\", provider),\n                    loadSignedContract(\"NftCertificates\", provider)\n                ]);\n                const contracts = {\n                    nftIdentities,\n                    nftSchool,\n                    nftCertificates\n                };\n                setGlobalListeners(ethereum);\n                setWeb3Api((0,_utils__WEBPACK_IMPORTED_MODULE_2__.createWeb3State)({\n                    ethereum,\n                    provider,\n                    contracts,\n                    isLoading: false\n                }));\n            } catch (e) {\n                setWeb3Api((param)=>{\n                    let { hooks , ...api } = param;\n                    return (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createWeb3State)({\n                        ...api,\n                        isLoading: false\n                    });\n                });\n            }\n        };\n        const loadSignedContract = async (name, provider)=>{\n            const contract = await (0,_utils__WEBPACK_IMPORTED_MODULE_2__.loadContract)(name, provider);\n            const signerContract = provider.getSigner();\n            return contract.connect(signerContract);\n        };\n        initWeb3();\n        return ()=>removeGlobalListeners(window.ethereum);\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Web3Context.Provider, {\n        value: web3Api,\n        children: children\n    }, void 0, false, {\n        fileName: \"E:\\\\learn\\\\learn-to-earn\\\\components\\\\providers\\\\web3\\\\index.tsx\",\n        lineNumber: 93,\n        columnNumber: 5\n    }, undefined);\n};\n_s(Web3Provider, \"eXQY8ecOJJ22qNa/rGS5TIHZ7i0=\");\n_c = Web3Provider;\nfunction useWeb3() {\n    _s1();\n    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(Web3Context);\n}\n_s1(useWeb3, \"gDsCjeeItUuvgOWf1v4qoK9RF6k=\");\nfunction useHooks() {\n    _s2();\n    const { hooks  } = useWeb3();\n    return hooks;\n}\n_s2(useHooks, \"pJtbI8L3V6q7YgcKn8NLfqjNxFc=\", false, function() {\n    return [\n        useWeb3\n    ];\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (Web3Provider);\nvar _c;\n$RefreshReg$(_c, \"Web3Provider\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZXJzL3dlYjMvaW5kZXgudHN4Pzc3MjgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBjcmVhdGVDb250ZXh0LFxyXG4gIEZDLFxyXG4gIFByb3BzV2l0aENoaWxkcmVuLFxyXG4gIHVzZUNvbnRleHQsXHJcbiAgdXNlRWZmZWN0LFxyXG4gIHVzZVN0YXRlLFxyXG59IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtcclxuICBjcmVhdGVEZWZhdWx0U3RhdGUsXHJcbiAgY3JlYXRlV2ViM1N0YXRlLFxyXG4gIGxvYWRDb250cmFjdCxcclxuICBXZWIzU3RhdGUsXHJcbn0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCB7IGV0aGVycyB9IGZyb20gJ2V0aGVycyc7XHJcbmltcG9ydCB7IE1ldGFNYXNrSW5wYWdlUHJvdmlkZXIgfSBmcm9tICdAbWV0YW1hc2svcHJvdmlkZXJzJztcclxuaW1wb3J0IHsgTmZ0TWFya2V0Q29udHJhY3QgfSBmcm9tICdAX3R5cGVzL25mdE1hcmtldENvbnRyYWN0JztcclxuXHJcbmNvbnN0IHBhZ2VSZWxvYWQgPSAoKSA9PiB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcblxyXG5jb25zdCBXZWIzQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8V2ViM1N0YXRlPihjcmVhdGVEZWZhdWx0U3RhdGUoKSk7XHJcblxyXG5jb25zdCBXZWIzUHJvdmlkZXI6IEZDPFByb3BzV2l0aENoaWxkcmVuPiA9ICh7IGNoaWxkcmVuIH0pID0+IHtcclxuICBjb25zdCBbd2ViM0FwaSwgc2V0V2ViM0FwaV0gPSB1c2VTdGF0ZTxXZWIzU3RhdGU+KGNyZWF0ZURlZmF1bHRTdGF0ZSgpKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlQWNjb3VudENoYW5nZSA9XHJcbiAgICAoZXRoZXJldW06IE1ldGFNYXNrSW5wYWdlUHJvdmlkZXIpID0+IGFzeW5jICgpID0+IHtcclxuICAgICAgY29uc3QgaXNMb2NrZWQgPSAhKGF3YWl0IGV0aGVyZXVtLl9tZXRhbWFzay5pc1VubG9ja2VkKCkpO1xyXG4gICAgICBpZiAoaXNMb2NrZWQpIHBhZ2VSZWxvYWQoKTtcclxuICAgIH07XHJcbiAgY29uc3Qgc2V0R2xvYmFsTGlzdGVuZXJzID0gKGV0aGVyZXVtOiBNZXRhTWFza0lucGFnZVByb3ZpZGVyKSA9PiB7XHJcbiAgICBldGhlcmV1bS5vbignY2hhaW5DaGFuZ2VkJywgcGFnZVJlbG9hZCk7XHJcbiAgICBldGhlcmV1bS5vbignYWNjb3VudHNDaGFuZ2VkJywgaGFuZGxlQWNjb3VudENoYW5nZShldGhlcmV1bSkpO1xyXG4gIH07XHJcbiAgY29uc3QgcmVtb3ZlR2xvYmFsTGlzdGVuZXJzID0gKGV0aGVyZXVtPzogTWV0YU1hc2tJbnBhZ2VQcm92aWRlcikgPT4ge1xyXG4gICAgZXRoZXJldW0/LnJlbW92ZUxpc3RlbmVyKCdjaGFpbkNoYW5nZWQnLCBwYWdlUmVsb2FkKTtcclxuICAgIGV0aGVyZXVtPy5yZW1vdmVMaXN0ZW5lcignYWNjb3VudHNDaGFuZ2VkJywgaGFuZGxlQWNjb3VudENoYW5nZShldGhlcmV1bSkpO1xyXG4gIH07XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBpbml0V2ViMyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBldGhlcmV1bSA9IHdpbmRvdy5ldGhlcmV1bTtcclxuICAgICAgICBjb25zdCBwcm92aWRlciA9IG5ldyBldGhlcnMucHJvdmlkZXJzLldlYjNQcm92aWRlcihldGhlcmV1bSBhcyBhbnkpO1xyXG5cclxuICAgICAgICBjb25zdCBuZnRTY2hvb2xDb250cmFjdCA9IGxvYWRDb250cmFjdCgnTmZ0U2Nob29sJywgcHJvdmlkZXIpO1xyXG4gICAgICAgIGNvbnN0IG5mdENlcnRpZmljYXRlc0NvbnRyYWN0ID0gbG9hZENvbnRyYWN0KCdOZnRDZXJ0aWZpY2F0ZXMnLCBwcm92aWRlcik7XHJcbiAgICAgICAgY29uc3QgW1xyXG4gICAgICAgICAgbmZ0SWRlbnRpdGllcyxcclxuICAgICAgICAgIG5mdFNjaG9vbCxcclxuICAgICAgICAgIG5mdENlcnRpZmljYXRlcyxcclxuICAgICAgICBdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgICAgbG9hZFNpZ25lZENvbnRyYWN0KCdOZnRJZGVudGl0aWVzJywgcHJvdmlkZXIpLFxyXG4gICAgICAgICAgbG9hZFNpZ25lZENvbnRyYWN0KCdOZnRTY2hvb2wnLCBwcm92aWRlciksXHJcbiAgICAgICAgICBsb2FkU2lnbmVkQ29udHJhY3QoJ05mdENlcnRpZmljYXRlcycsIHByb3ZpZGVyKSxcclxuICAgICAgICBdKTtcclxuICAgICAgICBjb25zdCBjb250cmFjdHMgPSB7XHJcbiAgICAgICAgICBuZnRJZGVudGl0aWVzLFxyXG4gICAgICAgICAgbmZ0U2Nob29sLFxyXG4gICAgICAgICAgbmZ0Q2VydGlmaWNhdGVzLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNldEdsb2JhbExpc3RlbmVycyhldGhlcmV1bSk7XHJcbiAgICAgICAgc2V0V2ViM0FwaShcclxuICAgICAgICAgIGNyZWF0ZVdlYjNTdGF0ZSh7XHJcbiAgICAgICAgICAgIGV0aGVyZXVtLFxyXG4gICAgICAgICAgICBwcm92aWRlcixcclxuICAgICAgICAgICAgY29udHJhY3RzLFxyXG4gICAgICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgc2V0V2ViM0FwaSgoeyBob29rcywgLi4uYXBpIH0pID0+XHJcbiAgICAgICAgICBjcmVhdGVXZWIzU3RhdGUoe1xyXG4gICAgICAgICAgICAuLi4oYXBpIGFzIGFueSksXHJcbiAgICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIGNvbnN0IGxvYWRTaWduZWRDb250cmFjdCA9IGFzeW5jIChuYW1lLCBwcm92aWRlcikgPT4ge1xyXG4gICAgICBjb25zdCBjb250cmFjdCA9IGF3YWl0IGxvYWRDb250cmFjdChuYW1lLCBwcm92aWRlcik7XHJcbiAgICAgIGNvbnN0IHNpZ25lckNvbnRyYWN0ID0gcHJvdmlkZXIuZ2V0U2lnbmVyKCk7XHJcbiAgICAgIHJldHVybiBjb250cmFjdC5jb25uZWN0KHNpZ25lckNvbnRyYWN0KTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0V2ViMygpO1xyXG4gICAgcmV0dXJuICgpID0+IHJlbW92ZUdsb2JhbExpc3RlbmVycyh3aW5kb3cuZXRoZXJldW0pO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxXZWIzQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17d2ViM0FwaX0+e2NoaWxkcmVufTwvV2ViM0NvbnRleHQuUHJvdmlkZXI+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VXZWIzKCkge1xyXG4gIHJldHVybiB1c2VDb250ZXh0KFdlYjNDb250ZXh0KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhvb2tzKCkge1xyXG4gIGNvbnN0IHsgaG9va3MgfSA9IHVzZVdlYjMoKTtcclxuXHJcbiAgcmV0dXJuIGhvb2tzO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBXZWIzUHJvdmlkZXI7XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiY3JlYXRlRGVmYXVsdFN0YXRlIiwiY3JlYXRlV2ViM1N0YXRlIiwibG9hZENvbnRyYWN0IiwiZXRoZXJzIiwicGFnZVJlbG9hZCIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVsb2FkIiwiV2ViM0NvbnRleHQiLCJXZWIzUHJvdmlkZXIiLCJjaGlsZHJlbiIsIndlYjNBcGkiLCJzZXRXZWIzQXBpIiwiaGFuZGxlQWNjb3VudENoYW5nZSIsImV0aGVyZXVtIiwiaXNMb2NrZWQiLCJfbWV0YW1hc2siLCJpc1VubG9ja2VkIiwic2V0R2xvYmFsTGlzdGVuZXJzIiwib24iLCJyZW1vdmVHbG9iYWxMaXN0ZW5lcnMiLCJyZW1vdmVMaXN0ZW5lciIsImluaXRXZWIzIiwicHJvdmlkZXIiLCJwcm92aWRlcnMiLCJuZnRTY2hvb2xDb250cmFjdCIsIm5mdENlcnRpZmljYXRlc0NvbnRyYWN0IiwibmZ0SWRlbnRpdGllcyIsIm5mdFNjaG9vbCIsIm5mdENlcnRpZmljYXRlcyIsIlByb21pc2UiLCJhbGwiLCJsb2FkU2lnbmVkQ29udHJhY3QiLCJjb250cmFjdHMiLCJpc0xvYWRpbmciLCJlIiwiaG9va3MiLCJhcGkiLCJuYW1lIiwiY29udHJhY3QiLCJzaWduZXJDb250cmFjdCIsImdldFNpZ25lciIsImNvbm5lY3QiLCJQcm92aWRlciIsInZhbHVlIiwidXNlV2ViMyIsInVzZUhvb2tzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/providers/web3/index.tsx\n"));

/***/ })

});