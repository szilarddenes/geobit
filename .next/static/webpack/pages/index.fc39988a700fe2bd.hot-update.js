"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "(pages-dir-browser)/./src/components/layout/Header.js":
/*!*****************************************!*\
  !*** ./src/components/layout/Header.js ***!
  \*****************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(pages-dir-browser)/./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(pages-dir-browser)/./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ \"(pages-dir-browser)/./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/image */ \"(pages-dir-browser)/./node_modules/next/image.js\");\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/router */ \"(pages-dir-browser)/./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);\n\nvar _s = $RefreshSig$();\n\n\n\n\nconst Header = ()=>{\n    _s();\n    const [isMenuOpen, setIsMenuOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [isScrolled, setIsScrolled] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"Header.useEffect\": ()=>{\n            const handleScroll = {\n                \"Header.useEffect.handleScroll\": ()=>{\n                    setIsScrolled(window.scrollY > 10);\n                }\n            }[\"Header.useEffect.handleScroll\"];\n            window.addEventListener('scroll', handleScroll);\n            return ({\n                \"Header.useEffect\": ()=>window.removeEventListener('scroll', handleScroll)\n            })[\"Header.useEffect\"];\n        }\n    }[\"Header.useEffect\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"header\", {\n        className: \"sticky top-0 z-50 transition-all \".concat(isScrolled ? 'bg-dark-lighter shadow-dark-sm' : 'bg-dark'),\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"container mx-auto px-4 sm:px-6 lg:px-8\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"flex justify-between items-center py-3\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"flex-shrink-0 -ml-3\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                href: \"/\",\n                                className: \"flex items-center\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_image__WEBPACK_IMPORTED_MODULE_3___default()), {\n                                    src: \"/logo3.svg\",\n                                    alt: \"GeoBit Logo\",\n                                    width: 280,\n                                    height: 90,\n                                    className: \"h-24 w-auto\",\n                                    priority: true\n                                }, void 0, false, {\n                                    fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                                    lineNumber: 27,\n                                    columnNumber: 15\n                                }, undefined)\n                            }, void 0, false, {\n                                fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                                lineNumber: 26,\n                                columnNumber: 13\n                            }, undefined)\n                        }, void 0, false, {\n                            fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                            lineNumber: 25,\n                            columnNumber: 11\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                            className: \"hidden md:flex space-x-8 justify-start ml-4\",\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/newsletters\",\n                                    className: \"text-lg font-bold \".concat(router.pathname === '/newsletters' || router.pathname.startsWith('/newsletters/') ? 'text-primary' : 'text-light-muted hover:text-primary'),\n                                    children: \"Newsletters\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                                    lineNumber: 40,\n                                    columnNumber: 13\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/advertise\",\n                                    className: \"text-lg font-bold \".concat(router.pathname === '/advertise' ? 'text-primary' : 'text-light-muted hover:text-primary'),\n                                    children: \"Advertise\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                                    lineNumber: 49,\n                                    columnNumber: 13\n                                }, undefined)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                            lineNumber: 39,\n                            columnNumber: 11\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"hidden md:block\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                href: \"/subscribe\",\n                                className: \"ml-8 inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-bold text-dark bg-primary hover:bg-primary-light\",\n                                children: \"Subscribe\"\n                            }, void 0, false, {\n                                fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                                lineNumber: 62,\n                                columnNumber: 13\n                            }, undefined)\n                        }, void 0, false, {\n                            fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                            lineNumber: 61,\n                            columnNumber: 11\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"md:hidden -mr-2 flex items-center\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                type: \"button\",\n                                className: \"inline-flex items-center justify-center p-3 rounded-md text-light-muted hover:text-primary hover:bg-dark-light focus:outline-none\",\n                                onClick: ()=>setIsMenuOpen(!isMenuOpen),\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                        className: \"sr-only\",\n                                        children: isMenuOpen ? 'Close menu' : 'Open menu'\n                                    }, void 0, false, {\n                                        fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                                        lineNumber: 77,\n                                        columnNumber: 15\n                                    }, undefined),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"svg\", {\n                                        className: \"\".concat(isMenuOpen ? 'hidden' : 'block', \" h-8 w-8\"),\n                                        xmlns: \"http://www.w3.org/2000/svg\",\n                                        fill: \"none\",\n                                        viewBox: \"0 0 24 24\",\n                                        stroke: \"currentColor\",\n                                        \"aria-hidden\": \"true\",\n                                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"path\", {\n                                            strokeLinecap: \"round\",\n                                            strokeLinejoin: \"round\",\n                                            strokeWidth: 2,\n                                            d: \"M4 6h16M4 12h16M4 18h16\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                                            lineNumber: 86,\n                                            columnNumber: 17\n                                        }, undefined)\n                                    }, void 0, false, {\n                                        fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                                        lineNumber: 78,\n                                        columnNumber: 15\n                                    }, undefined),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"svg\", {\n                                        className: \"\".concat(isMenuOpen ? 'block' : 'hidden', \" h-8 w-8\"),\n                                        xmlns: \"http://www.w3.org/2000/svg\",\n                                        fill: \"none\",\n                                        viewBox: \"0 0 24 24\",\n                                        stroke: \"currentColor\",\n                                        \"aria-hidden\": \"true\",\n                                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"path\", {\n                                            strokeLinecap: \"round\",\n                                            strokeLinejoin: \"round\",\n                                            strokeWidth: 2,\n                                            d: \"M6 18L18 6M6 6l12 12\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                                            lineNumber: 96,\n                                            columnNumber: 17\n                                        }, undefined)\n                                    }, void 0, false, {\n                                        fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                                        lineNumber: 88,\n                                        columnNumber: 15\n                                    }, undefined)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                                lineNumber: 72,\n                                columnNumber: 13\n                            }, undefined)\n                        }, void 0, false, {\n                            fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                            lineNumber: 71,\n                            columnNumber: 11\n                        }, undefined)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                    lineNumber: 23,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                lineNumber: 22,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"\".concat(isMenuOpen ? 'block' : 'hidden', \" md:hidden\"),\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"pt-2 pb-4 space-y-1 px-4 sm:px-6 bg-dark-lighter\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                            href: \"/newsletters\",\n                            className: \"block py-2 font-bold text-lg \".concat(router.pathname === '/newsletters' || router.pathname.startsWith('/newsletters/') ? 'text-primary' : 'text-light-muted hover:text-primary'),\n                            onClick: ()=>setIsMenuOpen(false),\n                            children: \"Newsletters\"\n                        }, void 0, false, {\n                            fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                            lineNumber: 106,\n                            columnNumber: 11\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                            href: \"/advertise\",\n                            className: \"block py-2 font-bold text-lg \".concat(router.pathname === '/advertise' ? 'text-primary' : 'text-light-muted hover:text-primary'),\n                            onClick: ()=>setIsMenuOpen(false),\n                            children: \"Advertise\"\n                        }, void 0, false, {\n                            fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                            lineNumber: 116,\n                            columnNumber: 11\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                            href: \"/subscribe\",\n                            className: \"block mt-4 w- text-center bg-primary text-dark font-bold py-2 px-4 rounded-md hover:bg-primary-light\",\n                            onClick: ()=>setIsMenuOpen(false),\n                            children: \"Subscribe\"\n                        }, void 0, false, {\n                            fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                            lineNumber: 126,\n                            columnNumber: 11\n                        }, undefined)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                    lineNumber: 105,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n                lineNumber: 104,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/solid.garden/@dev/geobit/src/components/layout/Header.js\",\n        lineNumber: 20,\n        columnNumber: 5\n    }, undefined);\n};\n_s(Header, \"cs3HRgYuix6o4ID8qxZ66oJ08tc=\", false, function() {\n    return [\n        next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter\n    ];\n});\n_c = Header;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Header);\nvar _c;\n$RefreshReg$(_c, \"Header\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9IZWFkZXIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUE0QztBQUNmO0FBQ0U7QUFDUztBQUV4QyxNQUFNSyxTQUFTOztJQUNiLE1BQU0sQ0FBQ0MsWUFBWUMsY0FBYyxHQUFHUCwrQ0FBUUEsQ0FBQztJQUM3QyxNQUFNLENBQUNRLFlBQVlDLGNBQWMsR0FBR1QsK0NBQVFBLENBQUM7SUFDN0MsTUFBTVUsU0FBU04sc0RBQVNBO0lBRXhCSCxnREFBU0E7NEJBQUM7WUFDUixNQUFNVTtpREFBZTtvQkFDbkJGLGNBQWNHLE9BQU9DLE9BQU8sR0FBRztnQkFDakM7O1lBQ0FELE9BQU9FLGdCQUFnQixDQUFDLFVBQVVIO1lBQ2xDO29DQUFPLElBQU1DLE9BQU9HLG1CQUFtQixDQUFDLFVBQVVKOztRQUNwRDsyQkFBRyxFQUFFO0lBRUwscUJBQ0UsOERBQUNLO1FBQU9DLFdBQVcsb0NBQ2hCLE9BRG9EVCxhQUFhLG1DQUFtQzs7MEJBRXJHLDhEQUFDVTtnQkFBSUQsV0FBVTswQkFDYiw0RUFBQ0M7b0JBQUlELFdBQVU7O3NDQUViLDhEQUFDQzs0QkFBSUQsV0FBVTtzQ0FDYiw0RUFBQ2Ysa0RBQUlBO2dDQUFDaUIsTUFBSztnQ0FBSUYsV0FBVTswQ0FDdkIsNEVBQUNkLG1EQUFLQTtvQ0FDSmlCLEtBQUk7b0NBQ0pDLEtBQUk7b0NBQ0pDLE9BQU87b0NBQ1BDLFFBQVE7b0NBQ1JOLFdBQVU7b0NBQ1ZPLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7c0NBTWQsOERBQUNDOzRCQUFJUixXQUFVOzs4Q0FDYiw4REFBQ2Ysa0RBQUlBO29DQUNIaUIsTUFBSztvQ0FDTEYsV0FBVyxxQkFHUixPQUg2QlAsT0FBT2dCLFFBQVEsS0FBSyxrQkFBa0JoQixPQUFPZ0IsUUFBUSxDQUFDQyxVQUFVLENBQUMsbUJBQzdGLGlCQUNBOzhDQUVMOzs7Ozs7OENBR0QsOERBQUN6QixrREFBSUE7b0NBQ0hpQixNQUFLO29DQUNMRixXQUFXLHFCQUdSLE9BSDZCUCxPQUFPZ0IsUUFBUSxLQUFLLGVBQ2hELGlCQUNBOzhDQUVMOzs7Ozs7Ozs7Ozs7c0NBTUgsOERBQUNSOzRCQUFJRCxXQUFVO3NDQUNiLDRFQUFDZixrREFBSUE7Z0NBQ0hpQixNQUFLO2dDQUNMRixXQUFVOzBDQUNYOzs7Ozs7Ozs7OztzQ0FNSCw4REFBQ0M7NEJBQUlELFdBQVU7c0NBQ2IsNEVBQUNXO2dDQUNDQyxNQUFLO2dDQUNMWixXQUFVO2dDQUNWYSxTQUFTLElBQU12QixjQUFjLENBQUNEOztrREFFOUIsOERBQUN5Qjt3Q0FBS2QsV0FBVTtrREFBV1gsYUFBYSxlQUFlOzs7Ozs7a0RBQ3ZELDhEQUFDMEI7d0NBQ0NmLFdBQVcsR0FBbUMsT0FBaENYLGFBQWEsV0FBVyxTQUFRO3dDQUM5QzJCLE9BQU07d0NBQ05DLE1BQUs7d0NBQ0xDLFNBQVE7d0NBQ1JDLFFBQU87d0NBQ1BDLGVBQVk7a0RBRVosNEVBQUNDOzRDQUFLQyxlQUFjOzRDQUFRQyxnQkFBZTs0Q0FBUUMsYUFBYTs0Q0FBR0MsR0FBRTs7Ozs7Ozs7Ozs7a0RBRXZFLDhEQUFDVjt3Q0FDQ2YsV0FBVyxHQUFtQyxPQUFoQ1gsYUFBYSxVQUFVLFVBQVM7d0NBQzlDMkIsT0FBTTt3Q0FDTkMsTUFBSzt3Q0FDTEMsU0FBUTt3Q0FDUkMsUUFBTzt3Q0FDUEMsZUFBWTtrREFFWiw0RUFBQ0M7NENBQUtDLGVBQWM7NENBQVFDLGdCQUFlOzRDQUFRQyxhQUFhOzRDQUFHQyxHQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBUS9FLDhEQUFDeEI7Z0JBQUlELFdBQVcsR0FBbUMsT0FBaENYLGFBQWEsVUFBVSxVQUFTOzBCQUNqRCw0RUFBQ1k7b0JBQUlELFdBQVU7O3NDQUNiLDhEQUFDZixrREFBSUE7NEJBQ0hpQixNQUFLOzRCQUNMRixXQUFXLGdDQUdSLE9BSHdDUCxPQUFPZ0IsUUFBUSxLQUFLLGtCQUFrQmhCLE9BQU9nQixRQUFRLENBQUNDLFVBQVUsQ0FBQyxtQkFDeEcsaUJBQ0E7NEJBRUpHLFNBQVMsSUFBTXZCLGNBQWM7c0NBQzlCOzs7Ozs7c0NBR0QsOERBQUNMLGtEQUFJQTs0QkFDSGlCLE1BQUs7NEJBQ0xGLFdBQVcsZ0NBR1IsT0FId0NQLE9BQU9nQixRQUFRLEtBQUssZUFDM0QsaUJBQ0E7NEJBRUpJLFNBQVMsSUFBTXZCLGNBQWM7c0NBQzlCOzs7Ozs7c0NBR0QsOERBQUNMLGtEQUFJQTs0QkFDSGlCLE1BQUs7NEJBQ0xGLFdBQVU7NEJBQ1ZhLFNBQVMsSUFBTXZCLGNBQWM7c0NBQzlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9YO0dBbklNRjs7UUFHV0Qsa0RBQVNBOzs7S0FIcEJDO0FBcUlOLGlFQUFlQSxNQUFNQSxFQUFDIiwic291cmNlcyI6WyIvVXNlcnMvc29saWQuZ2FyZGVuL0BkZXYvZ2VvYml0L3NyYy9jb21wb25lbnRzL2xheW91dC9IZWFkZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluayc7XG5pbXBvcnQgSW1hZ2UgZnJvbSAnbmV4dC9pbWFnZSc7XG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcic7XG5cbmNvbnN0IEhlYWRlciA9ICgpID0+IHtcbiAgY29uc3QgW2lzTWVudU9wZW4sIHNldElzTWVudU9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNTY3JvbGxlZCwgc2V0SXNTY3JvbGxlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlU2Nyb2xsID0gKCkgPT4ge1xuICAgICAgc2V0SXNTY3JvbGxlZCh3aW5kb3cuc2Nyb2xsWSA+IDEwKTtcbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBoYW5kbGVTY3JvbGwpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaGFuZGxlU2Nyb2xsKTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPGhlYWRlciBjbGFzc05hbWU9e2BzdGlja3kgdG9wLTAgei01MCB0cmFuc2l0aW9uLWFsbCAke2lzU2Nyb2xsZWQgPyAnYmctZGFyay1saWdodGVyIHNoYWRvdy1kYXJrLXNtJyA6ICdiZy1kYXJrJ1xuICAgICAgfWB9PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgbXgtYXV0byBweC00IHNtOnB4LTYgbGc6cHgtOFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBweS0zXCI+XG4gICAgICAgICAgey8qIExvZ28gKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LXNocmluay0wIC1tbC0zXCI+XG4gICAgICAgICAgICA8TGluayBocmVmPVwiL1wiIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgIDxJbWFnZVxuICAgICAgICAgICAgICAgIHNyYz1cIi9sb2dvMy5zdmdcIlxuICAgICAgICAgICAgICAgIGFsdD1cIkdlb0JpdCBMb2dvXCJcbiAgICAgICAgICAgICAgICB3aWR0aD17MjgwfVxuICAgICAgICAgICAgICAgIGhlaWdodD17OTB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC0yNCB3LWF1dG9cIlxuICAgICAgICAgICAgICAgIHByaW9yaXR5XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogRGVza3RvcCBOYXZpZ2F0aW9uICovfVxuICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPVwiaGlkZGVuIG1kOmZsZXggc3BhY2UteC04IGp1c3RpZnktc3RhcnQgbWwtNFwiPlxuICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgaHJlZj1cIi9uZXdzbGV0dGVyc1wiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRleHQtbGcgZm9udC1ib2xkICR7cm91dGVyLnBhdGhuYW1lID09PSAnL25ld3NsZXR0ZXJzJyB8fCByb3V0ZXIucGF0aG5hbWUuc3RhcnRzV2l0aCgnL25ld3NsZXR0ZXJzLycpXG4gICAgICAgICAgICAgICAgPyAndGV4dC1wcmltYXJ5J1xuICAgICAgICAgICAgICAgIDogJ3RleHQtbGlnaHQtbXV0ZWQgaG92ZXI6dGV4dC1wcmltYXJ5J1xuICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBOZXdzbGV0dGVyc1xuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgaHJlZj1cIi9hZHZlcnRpc2VcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0ZXh0LWxnIGZvbnQtYm9sZCAke3JvdXRlci5wYXRobmFtZSA9PT0gJy9hZHZlcnRpc2UnXG4gICAgICAgICAgICAgICAgPyAndGV4dC1wcmltYXJ5J1xuICAgICAgICAgICAgICAgIDogJ3RleHQtbGlnaHQtbXV0ZWQgaG92ZXI6dGV4dC1wcmltYXJ5J1xuICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBBZHZlcnRpc2VcbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L25hdj5cblxuICAgICAgICAgIHsvKiBTdWJzY3JpYmUgQnV0dG9uICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGlkZGVuIG1kOmJsb2NrXCI+XG4gICAgICAgICAgICA8TGlua1xuICAgICAgICAgICAgICBocmVmPVwiL3N1YnNjcmliZVwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1sLTggaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB4LTYgcHktMiBib3JkZXIgYm9yZGVyLXRyYW5zcGFyZW50IHJvdW5kZWQtbWQgc2hhZG93LXNtIHRleHQtYmFzZSBmb250LWJvbGQgdGV4dC1kYXJrIGJnLXByaW1hcnkgaG92ZXI6YmctcHJpbWFyeS1saWdodFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFN1YnNjcmliZVxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIE1vYmlsZSBNZW51IEJ1dHRvbiAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1kOmhpZGRlbiAtbXItMiBmbGV4IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtMyByb3VuZGVkLW1kIHRleHQtbGlnaHQtbXV0ZWQgaG92ZXI6dGV4dC1wcmltYXJ5IGhvdmVyOmJnLWRhcmstbGlnaHQgZm9jdXM6b3V0bGluZS1ub25lXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNNZW51T3BlbighaXNNZW51T3Blbil9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNyLW9ubHlcIj57aXNNZW51T3BlbiA/ICdDbG9zZSBtZW51JyA6ICdPcGVuIG1lbnUnfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7aXNNZW51T3BlbiA/ICdoaWRkZW4nIDogJ2Jsb2NrJ30gaC04IHctOGB9XG4gICAgICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxwYXRoIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBzdHJva2VXaWR0aD17Mn0gZD1cIk00IDZoMTZNNCAxMmgxNk00IDE4aDE2XCIgLz5cbiAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Ake2lzTWVudU9wZW4gPyAnYmxvY2snIDogJ2hpZGRlbid9IGgtOCB3LThgfVxuICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8cGF0aCBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlV2lkdGg9ezJ9IGQ9XCJNNiAxOEwxOCA2TTYgNmwxMiAxMlwiIC8+XG4gICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBNb2JpbGUgTWVudSAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtpc01lbnVPcGVuID8gJ2Jsb2NrJyA6ICdoaWRkZW4nfSBtZDpoaWRkZW5gfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdC0yIHBiLTQgc3BhY2UteS0xIHB4LTQgc206cHgtNiBiZy1kYXJrLWxpZ2h0ZXJcIj5cbiAgICAgICAgICA8TGlua1xuICAgICAgICAgICAgaHJlZj1cIi9uZXdzbGV0dGVyc1wiXG4gICAgICAgICAgICBjbGFzc05hbWU9e2BibG9jayBweS0yIGZvbnQtYm9sZCB0ZXh0LWxnICR7cm91dGVyLnBhdGhuYW1lID09PSAnL25ld3NsZXR0ZXJzJyB8fCByb3V0ZXIucGF0aG5hbWUuc3RhcnRzV2l0aCgnL25ld3NsZXR0ZXJzLycpXG4gICAgICAgICAgICAgID8gJ3RleHQtcHJpbWFyeSdcbiAgICAgICAgICAgICAgOiAndGV4dC1saWdodC1tdXRlZCBob3Zlcjp0ZXh0LXByaW1hcnknXG4gICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNNZW51T3BlbihmYWxzZSl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgTmV3c2xldHRlcnNcbiAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPExpbmtcbiAgICAgICAgICAgIGhyZWY9XCIvYWR2ZXJ0aXNlXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YGJsb2NrIHB5LTIgZm9udC1ib2xkIHRleHQtbGcgJHtyb3V0ZXIucGF0aG5hbWUgPT09ICcvYWR2ZXJ0aXNlJ1xuICAgICAgICAgICAgICA/ICd0ZXh0LXByaW1hcnknXG4gICAgICAgICAgICAgIDogJ3RleHQtbGlnaHQtbXV0ZWQgaG92ZXI6dGV4dC1wcmltYXJ5J1xuICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElzTWVudU9wZW4oZmFsc2UpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIEFkdmVydGlzZVxuICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8TGlua1xuICAgICAgICAgICAgaHJlZj1cIi9zdWJzY3JpYmVcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmxvY2sgbXQtNCB3LSB0ZXh0LWNlbnRlciBiZy1wcmltYXJ5IHRleHQtZGFyayBmb250LWJvbGQgcHktMiBweC00IHJvdW5kZWQtbWQgaG92ZXI6YmctcHJpbWFyeS1saWdodFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc01lbnVPcGVuKGZhbHNlKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBTdWJzY3JpYmVcbiAgICAgICAgICA8L0xpbms+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9oZWFkZXI+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBIZWFkZXI7Il0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiTGluayIsIkltYWdlIiwidXNlUm91dGVyIiwiSGVhZGVyIiwiaXNNZW51T3BlbiIsInNldElzTWVudU9wZW4iLCJpc1Njcm9sbGVkIiwic2V0SXNTY3JvbGxlZCIsInJvdXRlciIsImhhbmRsZVNjcm9sbCIsIndpbmRvdyIsInNjcm9sbFkiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImhlYWRlciIsImNsYXNzTmFtZSIsImRpdiIsImhyZWYiLCJzcmMiLCJhbHQiLCJ3aWR0aCIsImhlaWdodCIsInByaW9yaXR5IiwibmF2IiwicGF0aG5hbWUiLCJzdGFydHNXaXRoIiwiYnV0dG9uIiwidHlwZSIsIm9uQ2xpY2siLCJzcGFuIiwic3ZnIiwieG1sbnMiLCJmaWxsIiwidmlld0JveCIsInN0cm9rZSIsImFyaWEtaGlkZGVuIiwicGF0aCIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsInN0cm9rZVdpZHRoIiwiZCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-browser)/./src/components/layout/Header.js\n"));

/***/ })

});