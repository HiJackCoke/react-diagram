# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.7.2](https://github.com/taehunlim/react-diagram/compare/v0.7.1...v0.7.2) (2025-04-12)

### [0.7.1](https://github.com/taehunlim/react-diagram/compare/v0.1.0...v0.7.1) (2025-04-12)

## [0.7.0](https://github.com/taehunlim/react-diagram/compare/v0.6.0...v0.7.0) (2025-04-09)


### Features

* getSplittedNodes to get childNodes and otherNodes of dragItems ([b3013f4](https://github.com/taehunlim/react-diagram/commit/b3013f4ab23c4d31387aeddecdfa46d5fe10c423))
* PuzzleGenerator ([6d08b25](https://github.com/taehunlim/react-diagram/commit/6d08b2511cade9222350dc41a6bea840db27448a))
* to add multiple Ports to Node ([88f03d6](https://github.com/taehunlim/react-diagram/commit/88f03d6047bcdd4df735193e44b71a7640a551d8))
* to add multiple Ports to Node [#2](https://github.com/taehunlim/react-diagram/issues/2) ([9b4b06e](https://github.com/taehunlim/react-diagram/commit/9b4b06ee7e65eac7e211425277e1327c2980301a))
* to complete puzzle when all edges are correctly matched ([2341f72](https://github.com/taehunlim/react-diagram/commit/2341f725075f1e0e6f241e707bf289973eeab9d8))
* to keep drag selection active after dragSelectionKey is released ([dc8575a](https://github.com/taehunlim/react-diagram/commit/dc8575ab11f4c55a9e61522148524df6863af136))
* to remove used piece ([82438d1](https://github.com/taehunlim/react-diagram/commit/82438d10de39e4d5b01562cf3e8f5438d3dae886))
* update Nodes Intersection after initial rendering ([f7675ea](https://github.com/taehunlim/react-diagram/commit/f7675ea94c0dda44f640156dd95dce0354081316))
* useDragSelectionKeyPress ([2baa9b9](https://github.com/taehunlim/react-diagram/commit/2baa9b9ad874f33e2bfb1c9e6a792d6d2bebfab0))


### Bug Fixes

* default size in CustomNode ([9f305bb](https://github.com/taehunlim/react-diagram/commit/9f305bbbcf75352445e51968656d49656403cf87))
* drag selection not resetting on dragSelectionKey keyup ([078160a](https://github.com/taehunlim/react-diagram/commit/078160ac0de2c1d4ec422b6579bf99b95fda1962))
* ensure edge id uniqueness with multi-port support ([d81a595](https://github.com/taehunlim/react-diagram/commit/d81a59565f49c78d448cd7e5540875b3485785ae))
* issue where DragSelection was not working ([95bade9](https://github.com/taehunlim/react-diagram/commit/95bade90a1511e2279738a666ee45beaf84a4998))
* issue where Node was not selected ([fb0d822](https://github.com/taehunlim/react-diagram/commit/fb0d822a0b70c104710f87929bdda9cc8f11fef7))
* issue where state do not change when child Node(It has parentNode) is intersected ([eb0ad47](https://github.com/taehunlim/react-diagram/commit/eb0ad474879e10e37c522441d8e8b2ed58f8b345))
* issue where state of intersected Node do not change when intersecting with a child Node(It has parentNode) is intersecting ([3d43505](https://github.com/taehunlim/react-diagram/commit/3d43505b740ed3ce11aeac6a6fd6b0fffc586b82))
* restore onNodeDrag, onNodeDragStart, onNodeDragEnd event ([feffc38](https://github.com/taehunlim/react-diagram/commit/feffc38de26bd811c5fb39fdce29761e58581daa))
* to ensure node moves along with port when nodeExtent is set ([01ed8e6](https://github.com/taehunlim/react-diagram/commit/01ed8e6fe97c6a0036cba3db4aecfbb516cbc55d))
* type error caused by adding intersected function ([f2710ee](https://github.com/taehunlim/react-diagram/commit/f2710eecd48cdd7cc6119f13494a7032cb5bfb35))
* unable to drag SelectionBox due to Pane focus conflict ([29d16d3](https://github.com/taehunlim/react-diagram/commit/29d16d3fc41d2149fa0ebd61cefb0a8273e458c0))


### UI Styling

* selection mode css ([7179e7e](https://github.com/taehunlim/react-diagram/commit/7179e7e305b83e90519ccbeb866d150d8546c503))


### Docs

* git commit ([7dcce60](https://github.com/taehunlim/react-diagram/commit/7dcce60ca99849ac190287d2354dfb15079bd86d))


### Code Refactoring

* getPointerPosition to pass transform, gridStep, centerStep as parameters ([a66d569](https://github.com/taehunlim/react-diagram/commit/a66d569f62fabd5654e1d334069641c3d66446c2))
* to move DOM-related code to @diagram/core [#1](https://github.com/taehunlim/react-diagram/issues/1) ([e48b2c2](https://github.com/taehunlim/react-diagram/commit/e48b2c2ff29d225c55f692936a46c950c6169fb6))
* to move DOM-related code to @diagram/core [#2](https://github.com/taehunlim/react-diagram/issues/2) ([ef677f3](https://github.com/taehunlim/react-diagram/commit/ef677f3d63d4d87e1a3a191838c2e072b1fed601))
* to move DOM-related code to @diagram/core [#3](https://github.com/taehunlim/react-diagram/issues/3) ([6101790](https://github.com/taehunlim/react-diagram/commit/61017904b7c5fcc880a5f4c59a8915f5cbc360d6))
* to move DOM-related code to @diagram/core [#4](https://github.com/taehunlim/react-diagram/issues/4) ([892ea2b](https://github.com/taehunlim/react-diagram/commit/892ea2bc88a56cce54f0a5146e65054df6f7f76d))
* to move Drag-related code to @diagram/core [#1](https://github.com/taehunlim/react-diagram/issues/1) ([aae8e10](https://github.com/taehunlim/react-diagram/commit/aae8e1040f5a5ea5c0b56e8a124ed58bd9520165))
* to move Drag-related code to @diagram/core [#2](https://github.com/taehunlim/react-diagram/issues/2) ([6c76036](https://github.com/taehunlim/react-diagram/commit/6c76036822e8e7ab61904073c83f22a50a6c61ef))
* to move Drag-related code to @diagram/core [#3](https://github.com/taehunlim/react-diagram/issues/3) ([05efde1](https://github.com/taehunlim/react-diagram/commit/05efde1652b8cbf1119f59c0e8caa4d879b70d4c))
* to move Drag-related code to @diagram/core [#4](https://github.com/taehunlim/react-diagram/issues/4) ([ed572a3](https://github.com/taehunlim/react-diagram/commit/ed572a37f63bfaa9bcf714263eb2fa97b0a24dd5))
* to move Drag-related code to @diagram/core [#5](https://github.com/taehunlim/react-diagram/issues/5) ([6fb4825](https://github.com/taehunlim/react-diagram/commit/6fb48259161d2ebe3058613436b28dbf35632d0d))
* to move Drag-related code to @diagram/core [#6](https://github.com/taehunlim/react-diagram/issues/6) ([4298eb5](https://github.com/taehunlim/react-diagram/commit/4298eb530f50bb8701c04abd6f0dfa9811fa9ed1))
* to move Drag-related code to @diagram/core [#7](https://github.com/taehunlim/react-diagram/issues/7) ([90af807](https://github.com/taehunlim/react-diagram/commit/90af807ea10ffa58a0f79af3da2cf52e82542382))
* to move getMarkerId to @diagram/core ([5e5e07e](https://github.com/taehunlim/react-diagram/commit/5e5e07ef22467357308c587ebd37f8b57bec6da2))
* to move handlePointerDown to @diagram/core ([b363a01](https://github.com/taehunlim/react-diagram/commit/b363a01b01281776494f3ff880f4ac72ffe1edfd))
* to move internalsSymbol to @diagram/core ([63398b0](https://github.com/taehunlim/react-diagram/commit/63398b0944cdd432d10aef99ba4088f2466fc9e0))
* to move Node type to @diagram/core ([a2de6c7](https://github.com/taehunlim/react-diagram/commit/a2de6c746ca04911a740f5144fa10c176a20d34d))
* to move Panzoom-related code to @diagram/core [#1](https://github.com/taehunlim/react-diagram/issues/1) ([ff4cd50](https://github.com/taehunlim/react-diagram/commit/ff4cd504ca162838a2ec279a805f157cd708b339))
* to restore DragSelection logic after identifying root issue ([e608437](https://github.com/taehunlim/react-diagram/commit/e608437b863ca44fb6b206deac74024034fca365))
* updateNodesIntersection to fix issue already intersected Nodes would not intersect when new Node(dragging Node) was intersected and then unintersected ([1557e41](https://github.com/taehunlim/react-diagram/commit/1557e41be1691dbb743654c13f31e865e86f16a7))


### Adding Something

* default value to dragSelectionKeyCode ([93bf94e](https://github.com/taehunlim/react-diagram/commit/93bf94e25b45b465c5363a0e035006d0c7008fe8))
* default value to multiSelectionKeyCode ([de7b7ce](https://github.com/taehunlim/react-diagram/commit/de7b7ce57086e5677386844e9edba9e19b92c88c))
* default width, height to Node to prevent dimensions from occurring twice initially ([6efae90](https://github.com/taehunlim/react-diagram/commit/6efae90a10cc551f6e4627e53d3569fd607b5b90))
* example type to .versionrc ([10302d2](https://github.com/taehunlim/react-diagram/commit/10302d2aac48f04f91c5bb71b213486c276e0e3b))
* GetStepPosition, GetStepPathParams to packages make it available to users of this library ([b41a582](https://github.com/taehunlim/react-diagram/commit/b41a5822083925fab6fc468d5fc148874e38c83a))
* nodeOrigin props to react-cosmos-diagram ([e325e51](https://github.com/taehunlim/react-diagram/commit/e325e51f33f50d0297aebce650660aee4a9ee5eb))
* rest params to ReactDiagram ([2608319](https://github.com/taehunlim/react-diagram/commit/2608319c339b0ade2bc1e27ffb40195a04a3c1ab))

## [0.6.0](https://github.com/taehunlim/react-diagram/compare/v0.5.3...v0.6.0) (2024-02-13)


### Features

* dragSelectionKeyCode to change key for drag selecting ([5c37c21](https://github.com/taehunlim/react-diagram/commit/5c37c21790a0fa004cc8cd410658330b969bf6ab))


### Docs

* add demo to README.md ([5263a33](https://github.com/taehunlim/react-diagram/commit/5263a3304a9c44a02b94cc83cd4612f5a205c109))


### Adding Something

* example page for select func ([bbd4854](https://github.com/taehunlim/react-diagram/commit/bbd4854d24dea33e3d7f708c661de2a60f3d1b47))

### [0.5.3](https://github.com/taehunlim/react-diagram/compare/v0.5.2...v0.5.3) (2024-02-06)


### Bug Fixes

* issue of not getting intersected and selected state in CustomNode ([59d8ce9](https://github.com/taehunlim/react-diagram/commit/59d8ce98610f7c374277583c3895c381e3329fe5))
* issue where ConnectionPath is not displayed when selecting Port that does not have connected Edge ([8b4ffe6](https://github.com/taehunlim/react-diagram/commit/8b4ffe6314b27676e4e8ebde479fac937b08ebf5))


### Adding Something

* example page for CustomEdge ([f6d6a21](https://github.com/taehunlim/react-diagram/commit/f6d6a21d47b432b4a14f800d00150d500494e201))
* example page for CustomNode ([2ef286a](https://github.com/taehunlim/react-diagram/commit/2ef286a2d2625496c9065e0aa9b0a346b1bed28f))
* example page for Edge func ([99f2778](https://github.com/taehunlim/react-diagram/commit/99f27787ee2eff9ce3d15d53a17244a36771f1e9))

### [0.5.2](https://github.com/taehunlim/react-diagram/compare/v0.5.1...v0.5.2) (2024-02-01)


### Bug Fixes

* intersected status issue after drag drop when using smoothStep ([1fd30d6](https://github.com/taehunlim/react-diagram/commit/1fd30d649b0187d7b46a1330ea8a0ad76d5df90c))


### Adding Something

* example page for grid func ([f3c211e](https://github.com/taehunlim/react-diagram/commit/f3c211ee263e31218bcd3899f4d7be78cd97e5b5))

### [0.5.1](https://github.com/taehunlim/react-diagram/compare/v0.5.0...v0.5.1) (2024-01-31)

## [0.5.0](https://github.com/taehunlim/react-diagram/compare/v0.4.0...v0.5.0) (2024-01-30)


### Features

* deepEqual ([2193fac](https://github.com/taehunlim/react-diagram/commit/2193facebba53b8a715667099e6d2dcb503c18a0))
* intersectionNodes [#1](https://github.com/taehunlim/react-diagram/issues/1) ([567db88](https://github.com/taehunlim/react-diagram/commit/567db8870b4050b9ec65f994c81253c015705e86))
* intersectionNodes [#2](https://github.com/taehunlim/react-diagram/issues/2) ([b5a6a17](https://github.com/taehunlim/react-diagram/commit/b5a6a17b5dec8ac9ab63895f811af462c5d8a33e))
* resetIntersectedNodes ([b2b6280](https://github.com/taehunlim/react-diagram/commit/b2b6280392cbe9017aecdad6297724483c762ca1))
* updateNodesIntersection [#3](https://github.com/taehunlim/react-diagram/issues/3) ([b69e2d1](https://github.com/taehunlim/react-diagram/commit/b69e2d1b2fc921752f2b6960b16a1697cee3ebff))
* useUpdateIntersectionNodes ([146bbf2](https://github.com/taehunlim/react-diagram/commit/146bbf2af98da3440f9b89d388d7da379fc26d69))


### Bug Fixes

* issue where re-rendering occurr on Node other than Node where event is running ([b63725a](https://github.com/taehunlim/react-diagram/commit/b63725ae2f8e59dd6db33d2c91af2d8841ad7ded))


### Change Existing Behavior

* updateNodesIntersection be get intersection for multiple Nodes ([42ff5de](https://github.com/taehunlim/react-diagram/commit/42ff5de838c28f9afdc2d162d2a2dc0f6c143055))


### UI Styling

* intersected Node css ([1e875c7](https://github.com/taehunlim/react-diagram/commit/1e875c7e530c28b9149c0c5a23ac23275d61a412))


### Adding Something

* intersected class to dragging Node ([1adbc5b](https://github.com/taehunlim/react-diagram/commit/1adbc5be091316f733a33a15ba075096f2a49663))
* intersected class to Node ([2bef546](https://github.com/taehunlim/react-diagram/commit/2bef54629ff1b3887903321da4f69d0115641865))

## [0.4.0](https://github.com/taehunlim/react-diagram/compare/v0.3.0...v0.4.0) (2023-12-19)

### Features

-  Background to draw grid pattern ([b46af65](https://github.com/taehunlim/react-diagram/commit/b46af65160aa78f2f8d40ad1b0d1057d9a424f14))
-  centerGrid ([c88c2b1](https://github.com/taehunlim/react-diagram/commit/c88c2b13981ea6092b335446496f6948bb774aaf))
-  getStepPosition ([267c82d](https://github.com/taehunlim/react-diagram/commit/267c82dd4e63bc10f3376de35bae60f1e5881dab))
-  hasChangedPosition ([8484448](https://github.com/taehunlim/react-diagram/commit/84844489cda74e33fdb6f5927c8d717bd8069595))
-  SelectionBox(selected nodes) drag ([cf7211a](https://github.com/taehunlim/react-diagram/commit/cf7211a97745f2c2666eff834cf29a967da51a35))
-  smoothStep to use gridStep by dragging smoothly ([9eeb737](https://github.com/taehunlim/react-diagram/commit/9eeb737ad7127091ffa0666aaf80d90ff0c6e49f))
-  to inherit gap from gridStep prop when gap is not set in Background ([b4425cd](https://github.com/taehunlim/react-diagram/commit/b4425cdabc9f5d81a3437336dffe6dc57a249d6c))
-  updateNodePosition for updateNodesPosition in useDrag ([5349bba](https://github.com/taehunlim/react-diagram/commit/5349bba2e49277040c0ec4672bf8d646a9a5be7f))

### Bug Fixes

-  issue whene drag event did not work when touching(touch event) Node ([2a667dc](https://github.com/taehunlim/react-diagram/commit/2a667dc0167a69df3bce1ad0f718b578c0ab63e0))
-  issue where drag event is triggered by right-cliking ([802dde8](https://github.com/taehunlim/react-diagram/commit/802dde830855866575452b8b29d860e5a375911b))
-  issue where DragSelection is not inactive when selecting on other node ([225788c](https://github.com/taehunlim/react-diagram/commit/225788ce3bf33bc8498a5ec289dd7cd43a6b55fe))
-  issue with smoothStep not working due to missing touches in d3's drag end event ([1033bac](https://github.com/taehunlim/react-diagram/commit/1033baca6a3bf093cab47002e72c1e6231b3179e))

### Change Existing Behavior

-  export getStepPosition function instead of exporting stepPosition in useGetPointerPosition ([d31e943](https://github.com/taehunlim/react-diagram/commit/d31e9437944f68c2ff63618eb2f606a51fe198a4))

### Code Refactoring

-  getStepPosition ([216c91f](https://github.com/taehunlim/react-diagram/commit/216c91fc14459c06335054f35bd700be62ed4b6b))
-  updateNodesPosition by adding a callback params(updateFunc) to prevent Nodes updated with map() from being updated with map() again ([980a998](https://github.com/taehunlim/react-diagram/commit/980a998a555eb00c2f54ba6fbefa66df938ba710))
-  updateNodesPosition, updateNodePosition ([2460fe0](https://github.com/taehunlim/react-diagram/commit/2460fe037d5af6f0418685c2ab88f954dbdf8cbf))

## [0.3.0](https://github.com/taehunlim/react-diagram/compare/v0.2.0...v0.3.0) (2023-11-25)

### Features

-  connectionRadius ([1191867](https://github.com/taehunlim/react-diagram/commit/1191867322615e8f7303b187cbb21d2277a7037d))
-  edgeUpdaterRadius ([48549db](https://github.com/taehunlim/react-diagram/commit/48549db04dd8ae5b9fe31119e8dc05eaaae14a56))

### Bug Fixes

-  issue with closestPort finding wrong port location ([40443cc](https://github.com/taehunlim/react-diagram/commit/40443ccb035385c1858b535d7019efb0fbef9712))

### Code Refactoring

-  ConnectionEdge to use EdgeComponent of current Edge ([67a4a22](https://github.com/taehunlim/react-diagram/commit/67a4a22277ac2f8f6e39b99e69227d5550de43dd))

### UI Styling

-  Anchor hover ([29c6936](https://github.com/taehunlim/react-diagram/commit/29c6936b57e3c54cf341ded615391317a92b9222))

### Change Existing Behavior

-  Anchor is not visible when Edge is updating ([2a152c2](https://github.com/taehunlim/react-diagram/commit/2a152c213cc265b10d4af9132edd349a2908b970))

## [0.2.0](https://github.com/taehunlim/react-diagram/compare/v0.1.1...v0.2.0) (2023-11-20)

### Features

-  connectionEdgeComponent to custom connectionEdge ([37f1fda](https://github.com/taehunlim/react-diagram/commit/37f1fda9598097344f0a78435af99d7bae6fe0d9))
-  connectionEdgeContainerStyle, connectionEdgeStyle, connectionEdgeType ([a70b87e](https://github.com/taehunlim/react-diagram/commit/a70b87e9240ce48a8f405634f7aab420637157bb))

### UI Styling

-  default node style ([f8bdb90](https://github.com/taehunlim/react-diagram/commit/f8bdb90e24f74dc664e23abcb9f9d153cc9f5769))

### Change Variable Value

-  current edge type to type of ConnectionEdge ([b3b8a76](https://github.com/taehunlim/react-diagram/commit/b3b8a76e343c3765c8de0179ea4e94521371d378))
-  default edge type to straight ([f9cbf55](https://github.com/taehunlim/react-diagram/commit/f9cbf555f76d579b1b41696e0284e8b47907ba5a))
-  default of ConnectionType to straight ([de1a82b](https://github.com/taehunlim/react-diagram/commit/de1a82b2b63c4f3d628b5e1dc4ec198ddbee57b1))

### Docs

-  README.md ([2a8c93a](https://github.com/taehunlim/react-diagram/commit/2a8c93a9db646ab6856a3d7e33c64716f1514e74))

### [0.1.1](https://github.com/taehunlim/react-diagram/compare/v0.0.1...v0.1.1) (2023-11-16)

### Features

-  BezierEdge ([e163073](https://github.com/taehunlim/react-diagram/commit/e1630736dbd8a932ab733396fc5a62ee05cc4d0b))
-  boxToRect ([17ed43d](https://github.com/taehunlim/react-diagram/commit/17ed43d2e7e559a994b4d4597181bddae4c66f17))
-  DragSelection & Move: related code from ZoomPane ([1908671](https://github.com/taehunlim/react-diagram/commit/1908671a64ab5a74e5d4f5e35f664c92607d31c8))
-  DragSelection draw ([b2cb4d3](https://github.com/taehunlim/react-diagram/commit/b2cb4d3c82d79d2011877c10429b71bd8d386c09))
-  DragSelection draw when pressing shift key and mouseDown ([2403d42](https://github.com/taehunlim/react-diagram/commit/2403d42f268a8890ba55ddd790ab6d38cf107af0))
-  dragSelectionKeyPressed to enable dragSelection when pressing shift key ([af4e82b](https://github.com/taehunlim/react-diagram/commit/af4e82b8d5193d519b8294383f0a48e037da6d41))
-  getBoundsOfBoxes for use in getRectOfNodes ([57081f0](https://github.com/taehunlim/react-diagram/commit/57081f0748a644fe459f526f40b7a50b91567e7b))
-  getRectOfNodes to get box size of selected nodes using DragSelection ([ea19817](https://github.com/taehunlim/react-diagram/commit/ea1981733103fd8e9e6e15a82155098bcac80fdf))
-  isNode ([3a6b478](https://github.com/taehunlim/react-diagram/commit/3a6b47890b9a4f388d74c934d6fbae57a768df1b))
-  selected when node enter DragBox rect ([aa76053](https://github.com/taehunlim/react-diagram/commit/aa760537697a1c08dc03dcd617f149a543852ef5))
-  SelectionBox ([94bd3a7](https://github.com/taehunlim/react-diagram/commit/94bd3a7f455be5db9d0ea5c582f957241cc1ee50))
-  StraightEdge ([ac6cf83](https://github.com/taehunlim/react-diagram/commit/ac6cf8307ebeedae25c746ae2ab020fb66877207))

### Bug Fixes

-  issue where DragSelection is not drawn when drawing from bottom to top ([ce17994](https://github.com/taehunlim/react-diagram/commit/ce17994e8e54a4dd6946ddbe40ecff6652615d87))
-  issue where drawn DragSelection remained when mouse left viewport ([b7c5c93](https://github.com/taehunlim/react-diagram/commit/b7c5c930e4edc693bc153ddbbf3ddce5b6498643))
-  SelectionBox not being inactive ([0d0baf3](https://github.com/taehunlim/react-diagram/commit/0d0baf362bcd929de744677feb5109ea20e2c4af))
-  type error after remove NodeRenderer, EdgeRenderer from export type ([1c5c723](https://github.com/taehunlim/react-diagram/commit/1c5c72385401ae4ae765425ac906e8d982615738))

### Docs

-  git tag & release ([d16f0c9](https://github.com/taehunlim/react-diagram/commit/d16f0c95c89e894462235b7566277a85e6585a90))

### Code Refactoring

-  DragBox ([2c6fa6d](https://github.com/taehunlim/react-diagram/commit/2c6fa6d51f3e4fc7632e6fa7b46e85a9fd1065d4))
-  type to expor from Edges ([87e8d1d](https://github.com/taehunlim/react-diagram/commit/87e8d1d062b8206e221329d81715fb668ef9a522))
-  type to expor from Node ([a059aeb](https://github.com/taehunlim/react-diagram/commit/a059aebd85da615362605814948eed399569abc7))
-  type to expor from Port ([451f0f8](https://github.com/taehunlim/react-diagram/commit/451f0f8cb27c3460148e5f961febaa9c67a7568a))
-  type to expor from ReactDiagramProvider ([b81bcda](https://github.com/taehunlim/react-diagram/commit/b81bcdafba70be9c802239cadf529f6855539673))

### Adding Something

-  displayName to DragSelection ([12fd634](https://github.com/taehunlim/react-diagram/commit/12fd634d035e289bb1fd95e8103141591e4a4c8d))
-  dragBoxActive state to DragSelection ([29caaff](https://github.com/taehunlim/react-diagram/commit/29caaffd0e1b69c206f61bd8335d285d62e92f48))
-  transform to SelectionBox ([e3d54de](https://github.com/taehunlim/react-diagram/commit/e3d54de29f38d855b4d48e19d32ba23e2d9e4ad9))

### 0.0.1 (2023-10-26)

### Features

-  A11yDescriptions ([0526157](https://github.com/taehunlim/react-diagram/commit/052615738ed83210ce0b18a7ce2ea7d536fd7d50))
-  ability to create custom node type ([f9f775c](https://github.com/taehunlim/react-diagram/commit/f9f775c819d262db687b9834dd494e871cb853ee))
-  addEdge func ([9f864fc](https://github.com/taehunlim/react-diagram/commit/9f864fcf60bb96ac6617007b165ac84821eb3761))
-  addSelectedNodes, unSelectNodes and set the z-index of the selected node to 1000 ([20609f2](https://github.com/taehunlim/react-diagram/commit/20609f23ecb5c4d1a4fa0321901d28d4688fe3c4))
-  Anchor for Edge to disconnect connection ([972ba27](https://github.com/taehunlim/react-diagram/commit/972ba27e762097e0d884021ba75318928d547031))
-  autoPan to Port ([f71fbcd](https://github.com/taehunlim/react-diagram/commit/f71fbcd64ab8fb87e69b8730f784ccf5630f5577))
-  autoPanOnConnect to use autoPan when onConnect ([647adaa](https://github.com/taehunlim/react-diagram/commit/647adaa960ec02ca55171794c705f3926fc2aaf2))
-  autoPanOnNodeDrag to use autoPan when onNodeDrag ([df78dc0](https://github.com/taehunlim/react-diagram/commit/df78dc05e7bf6f8dd0ea99bca2552817af8d91e6))
-  calcAutoPanPosition func, calcAutoPanVelocity to automatically pan window when go out window view while dragging ([d5f2c7d](https://github.com/taehunlim/react-diagram/commit/d5f2c7d8f17bc29a689bc433e93c985f8080e3fc))
-  cancelConnection func to remove connecting ConnectEdge ([d7cc4d1](https://github.com/taehunlim/react-diagram/commit/d7cc4d134a6aa6065a39d6de6a2d734d86713f57))
-  ConnectionEdge ([21690d4](https://github.com/taehunlim/react-diagram/commit/21690d4fd3002e2e0938537730cfc29a5bf4b81d))
-  ConnectionLine to disconnect when clicking on target Anchor ([66cad2e](https://github.com/taehunlim/react-diagram/commit/66cad2e94355e5b4bc19eeafadf15c370df13e6e))
-  DiagramRenderer ([246bc97](https://github.com/taehunlim/react-diagram/commit/246bc97d05e9f69145a01e2a3931a73e8571b3be))
-  DiagramView ([4ac98b7](https://github.com/taehunlim/react-diagram/commit/4ac98b7ce14a7b9b8ec9d1e0b4435c7aa773a0fc))
-  Edge MarkerComponent ([d615284](https://github.com/taehunlim/react-diagram/commit/d6152848bccf0a06a4bcadcf52036f651435d78c))
-  Edge to connect between Nodes ([32a1fcf](https://github.com/taehunlim/react-diagram/commit/32a1fcf6fcfb0a9f606ffcd554a9313b0f81a9c5))
-  EdgeLabel ([35926cc](https://github.com/taehunlim/react-diagram/commit/35926cc2fecd451b22e89daaa874d839e8ee5ade))
-  getAllPort ([0383a47](https://github.com/taehunlim/react-diagram/commit/0383a47031ebb627bab5107c2578affbfada3f60))
-  getClosestPort when connecting Edge ([b534a34](https://github.com/taehunlim/react-diagram/commit/b534a342d6b0b63f597cfd340f4449ac187b34ed))
-  getConnection func to validate whether nodes can be connected to each other and get connected nodes id ([9575cba](https://github.com/taehunlim/react-diagram/commit/9575cbac06e7df5eae99b5d6d89c208f093a8d7a))
-  getPorts to get all Port of the desired type of the selected node ([246cbca](https://github.com/taehunlim/react-diagram/commit/246cbca1aae07ee8e90dfaa56dd4facdf53c3ac0))
-  getPortType ([5001fcc](https://github.com/taehunlim/react-diagram/commit/5001fcc79f3c61adea9c7ed7b49255658eb4d979))
-  gridStep to move node on grid ([86b5046](https://github.com/taehunlim/react-diagram/commit/86b5046c317343c653ca209cbd3ca56427b98ce2))
-  handlePointerDown func to get position value of Link connected from Port ([7d7a06c](https://github.com/taehunlim/react-diagram/commit/7d7a06c65d80f02d27763abeea2c70adac6e4ad5))
-  multiSelectionKeyCode to change key to multi-select nodes ([2c15fd4](https://github.com/taehunlim/react-diagram/commit/2c15fd4e9a81f8955583135a3f623b76c7d77be4))
-  Node, Port of Node ([841e086](https://github.com/taehunlim/react-diagram/commit/841e086bfa56cee414d4f738dfe63a9039fe2d66))
-  nodeExtent to specify the range within which a node can move ([50f6579](https://github.com/taehunlim/react-diagram/commit/50f65794f383ac4009594c16938891614237994c))
-  NodeRenderer, diagram node global state management(zustand) ([9b93a4e](https://github.com/taehunlim/react-diagram/commit/9b93a4eabf5ebdf648c65abde76663643a3960be))
-  noDragClassName to make element where the node is not dragged even when the inside of the node is dragged ([5fa4119](https://github.com/taehunlim/react-diagram/commit/5fa4119b6aed69dd75542bf0bf5f88fd9ea3b13c))
-  noPanClassName to prevent panning if target element is inside an element with the nopan ([7e8f907](https://github.com/taehunlim/react-diagram/commit/7e8f90730f791d4dbd2d368c421159b2a0497f3d))
-  onEdgeClick ([480f294](https://github.com/taehunlim/react-diagram/commit/480f29455736b0f7bbfa1b4a4268ac037ae9c391))
-  onEdgeContextMenu ([f99989d](https://github.com/taehunlim/react-diagram/commit/f99989dd2c6dbab80fcc55dd2da996bf498e918d))
-  onEdgeDoubleClick ([263de68](https://github.com/taehunlim/react-diagram/commit/263de68d90f0dafa49bea36958d5d669938a9f58))
-  onEdgeMouseEnter ([e6aca07](https://github.com/taehunlim/react-diagram/commit/e6aca070e40f8272aac05e7a9b50573feb149230))
-  onEdgeMouseLeave ([5059590](https://github.com/taehunlim/react-diagram/commit/50595900acd01063c276462854d687c3590d540b))
-  onEdgeMouseMove ([2a557d4](https://github.com/taehunlim/react-diagram/commit/2a557d42e09875783024866799f3d0ac78c2f83e))
-  onEdgeUpdate event ([1596245](https://github.com/taehunlim/react-diagram/commit/15962452349c96f224f32e43f9075d2c77532ad8))
-  onError ([5f9e32c](https://github.com/taehunlim/react-diagram/commit/5f9e32c08764770915d08791acbbb44b86ecea97))
-  onMove event when panning ([473b8d7](https://github.com/taehunlim/react-diagram/commit/473b8d7ee7d8c8db99f4cadc4703965a7e868cdd))
-  onMoveEnd event when panning end ([ce98df5](https://github.com/taehunlim/react-diagram/commit/ce98df5b5283b46d02008674ad7f0f618c1bf94c))
-  onMoveStart event when panning start ([7973659](https://github.com/taehunlim/react-diagram/commit/7973659161d054958ee0727c0f1b09c509744c86))
-  onNodeContextMenu ([d0d98f4](https://github.com/taehunlim/react-diagram/commit/d0d98f432db4417e3953b82f8a616ad230a39f5b))
-  onNodeDoubleClick ([97ed9d8](https://github.com/taehunlim/react-diagram/commit/97ed9d87788642f3bf4018682bb863d065a54bf8))
-  onNodeDrag, onNodeDragStart ([cbd4ef4](https://github.com/taehunlim/react-diagram/commit/cbd4ef470e70b6ab7a77274bef79f66cd226d643))
-  onNodeDragEnd ([aaf6a10](https://github.com/taehunlim/react-diagram/commit/aaf6a1022061ecb16f8f80249b5d3b4990a810b2))
-  onNodeMouseEnter ([658891f](https://github.com/taehunlim/react-diagram/commit/658891f550e4763f521642b30f6659579bcba770))
-  onNodeMouseLeave ([bef7635](https://github.com/taehunlim/react-diagram/commit/bef7635540d8752d0552af67e4660d10ab068ac7))
-  onNodeMouseMove ([2715cce](https://github.com/taehunlim/react-diagram/commit/2715ccea2d484b767002b56f24b48b63fc09f96e))
-  panBy action to automatically pan window when go out window view while dragging ([3627781](https://github.com/taehunlim/react-diagram/commit/3627781ecab992fbe36925ef3069177158aff52b))
-  ReactDiagram ([90870be](https://github.com/taehunlim/react-diagram/commit/90870be0a2506fd214efed3b18d93b79cad5149a))
-  resetSelectedElements to reset a selected node when clicking outside of a node ([ab639e6](https://github.com/taehunlim/react-diagram/commit/ab639e6dd5e4d049f849cf1a4103a923cb6633fc))
-  resizeObserver to set nodeInternals ([cafa4b9](https://github.com/taehunlim/react-diagram/commit/cafa4b9a735089bc115fcc994483100f3d1d632f))
-  set nodes, handle nodes visible ([1b224e3](https://github.com/taehunlim/react-diagram/commit/1b224e34f857c27c70739480d1c1a0d23291e83e))
-  to connect when the ConnectionEdge is near the closest Port ([e516414](https://github.com/taehunlim/react-diagram/commit/e516414a77a3b43269208894a4f0bd1735e869de))
-  to connection from target port to source port ([61122ff](https://github.com/taehunlim/react-diagram/commit/61122ff0968f775f45a1aa6395110d5ce4dcbca8))
-  to disconnect when clicking on source Anchor ([48bbef3](https://github.com/taehunlim/react-diagram/commit/48bbef37585a4372421d3875e1d50680801bc749))
-  to prevent native zoom event ([74d4ed7](https://github.com/taehunlim/react-diagram/commit/74d4ed74cb8caea155e42bc8ada872ab96fdbd20))
-  to prevent panning ([1d1dcb5](https://github.com/taehunlim/react-diagram/commit/1d1dcb524ce5edffa5c31c0b6c548fbf16ad3523))
-  to set width and height to initialNodes ([7de46c8](https://github.com/taehunlim/react-diagram/commit/7de46c863058af882c5ac5de6cf64d9c57b2f1a8))
-  updateEdge to remove old Edge and create new Edge with parameters of old Edge ([93f12e4](https://github.com/taehunlim/react-diagram/commit/93f12e45a1de90e8f846b27e39000b3389add0af))
-  useDrag to drag node ([a8023ec](https://github.com/taehunlim/react-diagram/commit/a8023ec130de2e5182e3ceef38cc716c6f80cd66))
-  useGetPointerPosition ([4dcaadc](https://github.com/taehunlim/react-diagram/commit/4dcaadc0717bfa69da91db8c66ae7611c91c46ea))
-  useGlobalKeyHandler to press command key to select multiple nodes ([764dbb6](https://github.com/taehunlim/react-diagram/commit/764dbb6b250dafbc4d868e1a7f961f20a6796156))
-  useNodeOrEdgeTypes to fix re-rendering in NodeRenderer ([641ccd0](https://github.com/taehunlim/react-diagram/commit/641ccd0a0a5dc5ca78ffaca208f57a2dd59321eb))
-  useNodesEdgesState to useNodesState, useEdgesState ([5aee8a4](https://github.com/taehunlim/react-diagram/commit/5aee8a4f536ea70c77b7086513ed5da8c3d091ec))
-  Viewport ([5995aba](https://github.com/taehunlim/react-diagram/commit/5995abaff198b5fa4c714818fbd51669febfc90c))
-  Wrapper to provide the library by wrapping it with ReactDiagram Provider. Additional wrapping of this library with a ReactDiagramProvider will remove the existing ReactDiagramProvider ([7bbfdc2](https://github.com/taehunlim/react-diagram/commit/7bbfdc2b69aeacc4eadd75bc9edb2caf8bceb0ac))
-  ZoomPane for screen panning [#1](https://github.com/taehunlim/react-diagram/issues/1) ([24931f9](https://github.com/taehunlim/react-diagram/commit/24931f9639ef1b04c4ef909a49e9387996150f33))

### Bug Fixes

-  closest port not being selected when there is another anchor closer than the port near the clicked anchor ([b749613](https://github.com/taehunlim/react-diagram/commit/b749613c837ee35d60d56c7e3dca99ce36f5bd0e))
-  directory path error ([b923b6f](https://github.com/taehunlim/react-diagram/commit/b923b6fb54322faf136e9c1b3a957a08e1be6b72))
-  dragging issue when right clicking on node ([ed7134d](https://github.com/taehunlim/react-diagram/commit/ed7134d1345e4418b4d10eb6e0ee23d365fc914a))
-  eslint ([88c0284](https://github.com/taehunlim/react-diagram/commit/88c0284f65a73683cfcbee1d85634b9113de17ab))
-  eslint ([6cb64f6](https://github.com/taehunlim/react-diagram/commit/6cb64f6f6eff144d3fe1143acc53a0fcabfec193))
-  eslint error ([9a2d099](https://github.com/taehunlim/react-diagram/commit/9a2d099b1b9105b6e8e27b4faf7e96add97012f9))
-  eslint error called 'Component definition is missing display name' in ReactDiagram ([1270b5e](https://github.com/taehunlim/react-diagram/commit/1270b5ed6875916cc34202132bf662472fbee2ed))
-  eslint error called 'couldn't find extend in .eslint.js' ([a465623](https://github.com/taehunlim/react-diagram/commit/a4656238b72fdcdaa006efc6a8e63d58174b902c))
-  eslint error called 'couldn't find extend in .eslint.js' ([bea2500](https://github.com/taehunlim/react-diagram/commit/bea2500c225288880a379e309436a7ed644c0670))
-  eslint error called 'Missing 'key' prop for element in iterator' in NodeRenderer, LinkRenderer ([75653fd](https://github.com/taehunlim/react-diagram/commit/75653fd0271972e60b551c21bce09e1985fe7b54))
-  height 0 when using DOCTYPE html ([ba8299d](https://github.com/taehunlim/react-diagram/commit/ba8299d714ef18811706f6485ae37cc54f5cee1f))
-  issue where connection was made when connecting to invalid port after connecting to valid port ([73563c6](https://github.com/taehunlim/react-diagram/commit/73563c64b3d31a0f98b51ee42cec0f2957f25969))
-  node hidden props value to be visible node, edge ([9569bd3](https://github.com/taehunlim/react-diagram/commit/9569bd304a641a549cb2f1abca5d8773556e6a43))
-  node initialized value ([94f3d81](https://github.com/taehunlim/react-diagram/commit/94f3d81df518cfe6c27be297d3ce0e3cc2aa309b))
-  NodeRenderer events props key so that node event work ([7226aa1](https://github.com/taehunlim/react-diagram/commit/7226aa1411d358e5ec163961c92f66a9e7f3ea7d))
-  onError returning params rather than error message ([0811d5a](https://github.com/taehunlim/react-diagram/commit/0811d5a570c8e0bc573c86c26983fe7625953436))
-  pane being dragged after right-clicking ([f2b5608](https://github.com/taehunlim/react-diagram/commit/f2b5608379f616b13232b47bb07f69db270d59df))
-  position to positionAbsolute in NodeRenderer to make parentNode work ([2bd7f99](https://github.com/taehunlim/react-diagram/commit/2bd7f994fe04a2e17d0509cf157258ea9dddf386))
-  return condition according to isSelectable value of handleNodeClick ([d146586](https://github.com/taehunlim/react-diagram/commit/d14658653fea41f2c3e5a70c83e5c8ad16061371))
-  type error due to elementsSelectable in initialState ([fa00677](https://github.com/taehunlim/react-diagram/commit/fa00677245bad70ba6fdca67b41a2081cb7c4a0c))
-  type error in onError ([b11754e](https://github.com/taehunlim/react-diagram/commit/b11754ed5801a1200a7784fbaff13952385b1f2e))
-  type error in ZoomPane ([2f849c2](https://github.com/taehunlim/react-diagram/commit/2f849c2bd6ce26a6c380a487d927c62611bd04aa))

### Change Existing Behavior

-  onConnect work on mouseUp ([77265a7](https://github.com/taehunlim/react-diagram/commit/77265a74f5417f4cf4528ceb8cb3fa84d296e857))

### Code Refactoring

-  devWarn func ([b0de268](https://github.com/taehunlim/react-diagram/commit/b0de2683930e28e559b1556b6393e88e4084f5db))
-  eslint, lint-staged ([3b21783](https://github.com/taehunlim/react-diagram/commit/3b217832aee0290ff2e7e225e8c76070c2dc265a))
-  minZoom, maxZoom ([aca445d](https://github.com/taehunlim/react-diagram/commit/aca445dcd5b29a05ebb789df8a171f189247fb7a))
-  nodeExtent so that specified extent also apply to edge ([9187cda](https://github.com/taehunlim/react-diagram/commit/9187cdafab81a46c4d6d71850d29fcc9aa3b3c59))
-  root eslint ([a560fae](https://github.com/taehunlim/react-diagram/commit/a560fae941282f550104d3be49b7694d86ceafd2))
-  translateExtent ([94247f1](https://github.com/taehunlim/react-diagram/commit/94247f11a378bad24edbadc586f98cb883e61d32))
-  tsconfig ([96e26e1](https://github.com/taehunlim/react-diagram/commit/96e26e1e564ca90a5a9be6af8436cc74936bbdd8))
-  vite build option ([4a49b27](https://github.com/taehunlim/react-diagram/commit/4a49b2725193e4d123b49d94e1a77efec7dd21da))
-  vite migrration ([61e1517](https://github.com/taehunlim/react-diagram/commit/61e15170ff73db43b7dfa4194bdb4f7b8b2ebaeb))
-  ZoomPaneProps ([fa833cf](https://github.com/taehunlim/react-diagram/commit/fa833cf02bb834a3d42fff40e92d69fc012fc515))

### Adding Something

-  010 error message ([1e72297](https://github.com/taehunlim/react-diagram/commit/1e72297f880332129f6c1cd3a33c0fea351ed518))
-  addNode button ([e41b5d9](https://github.com/taehunlim/react-diagram/commit/e41b5d9a2a02b3cff8a500fd8be0d07b2727f597))
-  connection reset code to onPointerUp func ([606e72d](https://github.com/taehunlim/react-diagram/commit/606e72dd70023599a1b74ea6930521b6bcca9244))
-  connectionNodeId to store when doing onMouseDown Port ([d47d360](https://github.com/taehunlim/react-diagram/commit/d47d360d991a96cf4e0bb737702926a7b635ef40))
-  connectionPortType to store when doing onMouseDown Port ([406d592](https://github.com/taehunlim/react-diagram/commit/406d592238b828c15751195cae5de3202b74afdd))
-  connectionPosition to store ([50b5161](https://github.com/taehunlim/react-diagram/commit/50b51616e7ee627471fd9e687ba20be01b20eb9a))
-  const centerLineIsBent ([686adc8](https://github.com/taehunlim/react-diagram/commit/686adc89800bb094a408532ee5dc34dcad39500a))
-  d3Selection to store ([730d4dd](https://github.com/taehunlim/react-diagram/commit/730d4dd4504fc4a0999b622274acc29792b75cab))
-  data props into Node ([0662cbb](https://github.com/taehunlim/react-diagram/commit/0662cbb2777b3249a6cd1167f81d664624fc785d))
-  data-portpos, port type to Port for get handleBounds ([f4b36f6](https://github.com/taehunlim/react-diagram/commit/f4b36f6eb99da04de4cca91bddf86c25b4715feb))
-  dragging className to wrapNode ([ce6cf7e](https://github.com/taehunlim/react-diagram/commit/ce6cf7e37bba69b03de56794bd54582207b790a3))
-  error code to errorMessages to fix type error in onError ([d086f76](https://github.com/taehunlim/react-diagram/commit/d086f76ccbcf3c1f5fd77c57481b72c25cf17125))
-  errorMessages ([cd07afa](https://github.com/taehunlim/react-diagram/commit/cd07afa14161cc74848c857ad05392bbde266902))
-  eslint to root ([71efcc1](https://github.com/taehunlim/react-diagram/commit/71efcc1d64f9d9eb36de54eafe5f3d00ee18ec7f))
-  eslint-config ([5ef6805](https://github.com/taehunlim/react-diagram/commit/5ef680556e73cf54d6ef0a2cd5339cb74af91a1e))
-  event validation code to ZoomPane ([68d436e](https://github.com/taehunlim/react-diagram/commit/68d436e19191ef414aeae4dc0c75dad47abd93bc))
-  handleNodeClick in useDrag to change from click to drag start to add selected ([5e0a143](https://github.com/taehunlim/react-diagram/commit/5e0a14308874dc0a8bf2bb09205729930254c55c))
-  index.ts to packages ([b59ff85](https://github.com/taehunlim/react-diagram/commit/b59ff85636326b7ead478d95ce5f591375759cf5))
-  isDraggable to const hasPointerEvents in wrapNode to make node draggable without adding onNodeClick ([d410ac7](https://github.com/taehunlim/react-diagram/commit/d410ac73ce6693ef39c7d8ff53b9a6fe9249de61))
-  isExistsConnection func to addEdge maintain unique edge ([c65ebcd](https://github.com/taehunlim/react-diagram/commit/c65ebcdd38ff188ed0a49435652e1c18336b652f))
-  node hidden props ([8881acf](https://github.com/taehunlim/react-diagram/commit/8881acfad16e17fc72a0fd7e28f6849c2829bfc9))
-  nodesDraggable props ([07b4481](https://github.com/taehunlim/react-diagram/commit/07b448134f01ee30669e9c3da11bb44b2f66494e))
-  onConnect to StoreUpdate to get the node connected state ([18fdf68](https://github.com/taehunlim/react-diagram/commit/18fdf684482198c40358dbc173eb3d9d86e12def))
-  onConnectEnd event ([9d7f63c](https://github.com/taehunlim/react-diagram/commit/9d7f63cb9f39afc290404e6d2a3352c0e01ff5a8))
-  onConnectStart event ([3ac4e5a](https://github.com/taehunlim/react-diagram/commit/3ac4e5ab3c49aaf83479ce5e2d490bdc6951cc17))
-  package.json ([83c6106](https://github.com/taehunlim/react-diagram/commit/83c61068e59029113350962a20daf8e246d928d8))
-  postcss-config ([dffb8c0](https://github.com/taehunlim/react-diagram/commit/dffb8c00aeda6cc622eed2a01ac483e4f9554191))
-  React memo to DiagramView ([290b379](https://github.com/taehunlim/react-diagram/commit/290b3791b58d072d3f767d5bbcb70df1d399c9c5))
-  rollup-config ([94fb139](https://github.com/taehunlim/react-diagram/commit/94fb13911ee97421c7967a8347b1e9c6b421f86e))
-  set code to updateNode Dimensions to make nodes visible without adding onNodesChange to ReactDiagram on initial render ([81c7ed1](https://github.com/taehunlim/react-diagram/commit/81c7ed1e4091d81cae44c6b63e0dd56279576b33))
-  touch event to Port ([fe0313a](https://github.com/taehunlim/react-diagram/commit/fe0313a76e9ed73813c821aa8472f35f38c954cb))
-  tsconfig to packages ([4ce6458](https://github.com/taehunlim/react-diagram/commit/4ce64587bed1909ff25772a9da6db747ae737e0b))
-  updateNodePositions reset code when drag end ([ef897d0](https://github.com/taehunlim/react-diagram/commit/ef897d0a81dddbd04e2513ddccbcf2c0f176f3a3))
-  validation to ConnectionPath so that it only works when portType is source ([9718e33](https://github.com/taehunlim/react-diagram/commit/9718e33b46276aba1a1fd69ce78a16404b61c140))

### UI Styling

-  .react-diagram ([d7c0c13](https://github.com/taehunlim/react-diagram/commit/d7c0c132ec9bfee61487a1a9a8f8180aa31879a6))
-  add focus-visible to default node ([1fa7151](https://github.com/taehunlim/react-diagram/commit/1fa7151329fee298adbeb62f0405044c92f1bc87))
-  react-diagram\_\_container, containerStyle ([05fdcc7](https://github.com/taehunlim/react-diagram/commit/05fdcc7f0407106cdad0b0b9940922b8e44cb19d))
-  selected node style ([2e11ae2](https://github.com/taehunlim/react-diagram/commit/2e11ae2adf952cf51d1fb0fcb5925fedd673b783))

### Docs

-  CHANGELOG.md ([e490240](https://github.com/taehunlim/react-diagram/commit/e49024096a2f26ae9ea2e2886c4970e506e6f7c3))

## 0.0.0 (2023-10-25)

### Features

-  A11yDescriptions ([0526157](https://github.com/taehunlim/react-diagram/commit/052615738ed83210ce0b18a7ce2ea7d536fd7d50))
-  ability to create custom node type ([f9f775c](https://github.com/taehunlim/react-diagram/commit/f9f775c819d262db687b9834dd494e871cb853ee))
-  addEdge func ([9f864fc](https://github.com/taehunlim/react-diagram/commit/9f864fcf60bb96ac6617007b165ac84821eb3761))
-  addSelectedNodes, unSelectNodes and set the z-index of the selected node to 1000 ([20609f2](https://github.com/taehunlim/react-diagram/commit/20609f23ecb5c4d1a4fa0321901d28d4688fe3c4))
-  Anchor for Edge to disconnect connection ([972ba27](https://github.com/taehunlim/react-diagram/commit/972ba27e762097e0d884021ba75318928d547031))
-  autoPan to Port ([f71fbcd](https://github.com/taehunlim/react-diagram/commit/f71fbcd64ab8fb87e69b8730f784ccf5630f5577))
-  autoPanOnConnect to use autoPan when onConnect ([647adaa](https://github.com/taehunlim/react-diagram/commit/647adaa960ec02ca55171794c705f3926fc2aaf2))
-  autoPanOnNodeDrag to use autoPan when onNodeDrag ([df78dc0](https://github.com/taehunlim/react-diagram/commit/df78dc05e7bf6f8dd0ea99bca2552817af8d91e6))
-  calcAutoPanPosition func, calcAutoPanVelocity to automatically pan window when go out window view while dragging ([d5f2c7d](https://github.com/taehunlim/react-diagram/commit/d5f2c7d8f17bc29a689bc433e93c985f8080e3fc))
-  cancelConnection func to remove connecting ConnectEdge ([d7cc4d1](https://github.com/taehunlim/react-diagram/commit/d7cc4d134a6aa6065a39d6de6a2d734d86713f57))
-  ConnectionEdge ([21690d4](https://github.com/taehunlim/react-diagram/commit/21690d4fd3002e2e0938537730cfc29a5bf4b81d))
-  ConnectionLine to disconnect when clicking on target Anchor ([66cad2e](https://github.com/taehunlim/react-diagram/commit/66cad2e94355e5b4bc19eeafadf15c370df13e6e))
-  DiagramRenderer ([246bc97](https://github.com/taehunlim/react-diagram/commit/246bc97d05e9f69145a01e2a3931a73e8571b3be))
-  DiagramView ([4ac98b7](https://github.com/taehunlim/react-diagram/commit/4ac98b7ce14a7b9b8ec9d1e0b4435c7aa773a0fc))
-  Edge MarkerComponent ([d615284](https://github.com/taehunlim/react-diagram/commit/d6152848bccf0a06a4bcadcf52036f651435d78c))
-  Edge to connect between Nodes ([32a1fcf](https://github.com/taehunlim/react-diagram/commit/32a1fcf6fcfb0a9f606ffcd554a9313b0f81a9c5))
-  EdgeLabel ([35926cc](https://github.com/taehunlim/react-diagram/commit/35926cc2fecd451b22e89daaa874d839e8ee5ade))
-  getAllPort ([0383a47](https://github.com/taehunlim/react-diagram/commit/0383a47031ebb627bab5107c2578affbfada3f60))
-  getClosestPort when connecting Edge ([b534a34](https://github.com/taehunlim/react-diagram/commit/b534a342d6b0b63f597cfd340f4449ac187b34ed))
-  getConnection func to validate whether nodes can be connected to each other and get connected nodes id ([9575cba](https://github.com/taehunlim/react-diagram/commit/9575cbac06e7df5eae99b5d6d89c208f093a8d7a))
-  getPorts to get all Port of the desired type of the selected node ([246cbca](https://github.com/taehunlim/react-diagram/commit/246cbca1aae07ee8e90dfaa56dd4facdf53c3ac0))
-  getPortType ([5001fcc](https://github.com/taehunlim/react-diagram/commit/5001fcc79f3c61adea9c7ed7b49255658eb4d979))
-  gridStep to move node on grid ([86b5046](https://github.com/taehunlim/react-diagram/commit/86b5046c317343c653ca209cbd3ca56427b98ce2))
-  handlePointerDown func to get position value of Link connected from Port ([7d7a06c](https://github.com/taehunlim/react-diagram/commit/7d7a06c65d80f02d27763abeea2c70adac6e4ad5))
-  multiSelectionKeyCode to change key to multi-select nodes ([2c15fd4](https://github.com/taehunlim/react-diagram/commit/2c15fd4e9a81f8955583135a3f623b76c7d77be4))
-  Node, Port of Node ([841e086](https://github.com/taehunlim/react-diagram/commit/841e086bfa56cee414d4f738dfe63a9039fe2d66))
-  nodeExtent to specify the range within which a node can move ([50f6579](https://github.com/taehunlim/react-diagram/commit/50f65794f383ac4009594c16938891614237994c))
-  NodeRenderer, diagram node global state management(zustand) ([9b93a4e](https://github.com/taehunlim/react-diagram/commit/9b93a4eabf5ebdf648c65abde76663643a3960be))
-  noDragClassName to make element where the node is not dragged even when the inside of the node is dragged ([5fa4119](https://github.com/taehunlim/react-diagram/commit/5fa4119b6aed69dd75542bf0bf5f88fd9ea3b13c))
-  noPanClassName to prevent panning if target element is inside an element with the nopan ([7e8f907](https://github.com/taehunlim/react-diagram/commit/7e8f90730f791d4dbd2d368c421159b2a0497f3d))
-  onEdgeClick ([480f294](https://github.com/taehunlim/react-diagram/commit/480f29455736b0f7bbfa1b4a4268ac037ae9c391))
-  onEdgeContextMenu ([f99989d](https://github.com/taehunlim/react-diagram/commit/f99989dd2c6dbab80fcc55dd2da996bf498e918d))
-  onEdgeDoubleClick ([263de68](https://github.com/taehunlim/react-diagram/commit/263de68d90f0dafa49bea36958d5d669938a9f58))
-  onEdgeMouseEnter ([e6aca07](https://github.com/taehunlim/react-diagram/commit/e6aca070e40f8272aac05e7a9b50573feb149230))
-  onEdgeMouseLeave ([5059590](https://github.com/taehunlim/react-diagram/commit/50595900acd01063c276462854d687c3590d540b))
-  onEdgeMouseMove ([2a557d4](https://github.com/taehunlim/react-diagram/commit/2a557d42e09875783024866799f3d0ac78c2f83e))
-  onEdgeUpdate event ([1596245](https://github.com/taehunlim/react-diagram/commit/15962452349c96f224f32e43f9075d2c77532ad8))
-  onError ([5f9e32c](https://github.com/taehunlim/react-diagram/commit/5f9e32c08764770915d08791acbbb44b86ecea97))
-  onMove event when panning ([473b8d7](https://github.com/taehunlim/react-diagram/commit/473b8d7ee7d8c8db99f4cadc4703965a7e868cdd))
-  onMoveEnd event when panning end ([ce98df5](https://github.com/taehunlim/react-diagram/commit/ce98df5b5283b46d02008674ad7f0f618c1bf94c))
-  onMoveStart event when panning start ([7973659](https://github.com/taehunlim/react-diagram/commit/7973659161d054958ee0727c0f1b09c509744c86))
-  onNodeContextMenu ([d0d98f4](https://github.com/taehunlim/react-diagram/commit/d0d98f432db4417e3953b82f8a616ad230a39f5b))
-  onNodeDoubleClick ([97ed9d8](https://github.com/taehunlim/react-diagram/commit/97ed9d87788642f3bf4018682bb863d065a54bf8))
-  onNodeDrag, onNodeDragStart ([cbd4ef4](https://github.com/taehunlim/react-diagram/commit/cbd4ef470e70b6ab7a77274bef79f66cd226d643))
-  onNodeDragEnd ([aaf6a10](https://github.com/taehunlim/react-diagram/commit/aaf6a1022061ecb16f8f80249b5d3b4990a810b2))
-  onNodeMouseEnter ([658891f](https://github.com/taehunlim/react-diagram/commit/658891f550e4763f521642b30f6659579bcba770))
-  onNodeMouseLeave ([bef7635](https://github.com/taehunlim/react-diagram/commit/bef7635540d8752d0552af67e4660d10ab068ac7))
-  onNodeMouseMove ([2715cce](https://github.com/taehunlim/react-diagram/commit/2715ccea2d484b767002b56f24b48b63fc09f96e))
-  panBy action to automatically pan window when go out window view while dragging ([3627781](https://github.com/taehunlim/react-diagram/commit/3627781ecab992fbe36925ef3069177158aff52b))
-  ReactDiagram ([90870be](https://github.com/taehunlim/react-diagram/commit/90870be0a2506fd214efed3b18d93b79cad5149a))
-  resetSelectedElements to reset a selected node when clicking outside of a node ([ab639e6](https://github.com/taehunlim/react-diagram/commit/ab639e6dd5e4d049f849cf1a4103a923cb6633fc))
-  resizeObserver to set nodeInternals ([cafa4b9](https://github.com/taehunlim/react-diagram/commit/cafa4b9a735089bc115fcc994483100f3d1d632f))
-  set nodes, handle nodes visible ([1b224e3](https://github.com/taehunlim/react-diagram/commit/1b224e34f857c27c70739480d1c1a0d23291e83e))
-  to connect when the ConnectionEdge is near the closest Port ([e516414](https://github.com/taehunlim/react-diagram/commit/e516414a77a3b43269208894a4f0bd1735e869de))
-  to connection from target port to source port ([61122ff](https://github.com/taehunlim/react-diagram/commit/61122ff0968f775f45a1aa6395110d5ce4dcbca8))
-  to disconnect when clicking on source Anchor ([48bbef3](https://github.com/taehunlim/react-diagram/commit/48bbef37585a4372421d3875e1d50680801bc749))
-  to prevent native zoom event ([74d4ed7](https://github.com/taehunlim/react-diagram/commit/74d4ed74cb8caea155e42bc8ada872ab96fdbd20))
-  to prevent panning ([1d1dcb5](https://github.com/taehunlim/react-diagram/commit/1d1dcb524ce5edffa5c31c0b6c548fbf16ad3523))
-  to set width and height to initialNodes ([7de46c8](https://github.com/taehunlim/react-diagram/commit/7de46c863058af882c5ac5de6cf64d9c57b2f1a8))
-  updateEdge to remove old Edge and create new Edge with parameters of old Edge ([93f12e4](https://github.com/taehunlim/react-diagram/commit/93f12e45a1de90e8f846b27e39000b3389add0af))
-  useDrag to drag node ([a8023ec](https://github.com/taehunlim/react-diagram/commit/a8023ec130de2e5182e3ceef38cc716c6f80cd66))
-  useGetPointerPosition ([4dcaadc](https://github.com/taehunlim/react-diagram/commit/4dcaadc0717bfa69da91db8c66ae7611c91c46ea))
-  useGlobalKeyHandler to press command key to select multiple nodes ([764dbb6](https://github.com/taehunlim/react-diagram/commit/764dbb6b250dafbc4d868e1a7f961f20a6796156))
-  useNodeOrEdgeTypes to fix re-rendering in NodeRenderer ([641ccd0](https://github.com/taehunlim/react-diagram/commit/641ccd0a0a5dc5ca78ffaca208f57a2dd59321eb))
-  useNodesEdgesState to useNodesState, useEdgesState ([5aee8a4](https://github.com/taehunlim/react-diagram/commit/5aee8a4f536ea70c77b7086513ed5da8c3d091ec))
-  Viewport ([5995aba](https://github.com/taehunlim/react-diagram/commit/5995abaff198b5fa4c714818fbd51669febfc90c))
-  Wrapper to provide the library by wrapping it with ReactDiagram Provider. Additional wrapping of this library with a ReactDiagramProvider will remove the existing ReactDiagramProvider ([7bbfdc2](https://github.com/taehunlim/react-diagram/commit/7bbfdc2b69aeacc4eadd75bc9edb2caf8bceb0ac))
-  ZoomPane for screen panning [#1](https://github.com/taehunlim/react-diagram/issues/1) ([24931f9](https://github.com/taehunlim/react-diagram/commit/24931f9639ef1b04c4ef909a49e9387996150f33))

### Bug Fixes

-  closest port not being selected when there is another anchor closer than the port near the clicked anchor ([b749613](https://github.com/taehunlim/react-diagram/commit/b749613c837ee35d60d56c7e3dca99ce36f5bd0e))
-  directory path error ([b923b6f](https://github.com/taehunlim/react-diagram/commit/b923b6fb54322faf136e9c1b3a957a08e1be6b72))
-  dragging issue when right clicking on node ([ed7134d](https://github.com/taehunlim/react-diagram/commit/ed7134d1345e4418b4d10eb6e0ee23d365fc914a))
-  eslint ([88c0284](https://github.com/taehunlim/react-diagram/commit/88c0284f65a73683cfcbee1d85634b9113de17ab))
-  eslint ([6cb64f6](https://github.com/taehunlim/react-diagram/commit/6cb64f6f6eff144d3fe1143acc53a0fcabfec193))
-  eslint error ([9a2d099](https://github.com/taehunlim/react-diagram/commit/9a2d099b1b9105b6e8e27b4faf7e96add97012f9))
-  eslint error called 'Component definition is missing display name' in ReactDiagram ([1270b5e](https://github.com/taehunlim/react-diagram/commit/1270b5ed6875916cc34202132bf662472fbee2ed))
-  eslint error called 'couldn't find extend in .eslint.js' ([a465623](https://github.com/taehunlim/react-diagram/commit/a4656238b72fdcdaa006efc6a8e63d58174b902c))
-  eslint error called 'couldn't find extend in .eslint.js' ([bea2500](https://github.com/taehunlim/react-diagram/commit/bea2500c225288880a379e309436a7ed644c0670))
-  eslint error called 'Missing 'key' prop for element in iterator' in NodeRenderer, LinkRenderer ([75653fd](https://github.com/taehunlim/react-diagram/commit/75653fd0271972e60b551c21bce09e1985fe7b54))
-  height 0 when using DOCTYPE html ([ba8299d](https://github.com/taehunlim/react-diagram/commit/ba8299d714ef18811706f6485ae37cc54f5cee1f))
-  issue where connection was made when connecting to invalid port after connecting to valid port ([73563c6](https://github.com/taehunlim/react-diagram/commit/73563c64b3d31a0f98b51ee42cec0f2957f25969))
-  node hidden props value to be visible node, edge ([9569bd3](https://github.com/taehunlim/react-diagram/commit/9569bd304a641a549cb2f1abca5d8773556e6a43))
-  node initialized value ([94f3d81](https://github.com/taehunlim/react-diagram/commit/94f3d81df518cfe6c27be297d3ce0e3cc2aa309b))
-  NodeRenderer events props key so that node event work ([7226aa1](https://github.com/taehunlim/react-diagram/commit/7226aa1411d358e5ec163961c92f66a9e7f3ea7d))
-  onError returning params rather than error message ([0811d5a](https://github.com/taehunlim/react-diagram/commit/0811d5a570c8e0bc573c86c26983fe7625953436))
-  pane being dragged after right-clicking ([f2b5608](https://github.com/taehunlim/react-diagram/commit/f2b5608379f616b13232b47bb07f69db270d59df))
-  position to positionAbsolute in NodeRenderer to make parentNode work ([2bd7f99](https://github.com/taehunlim/react-diagram/commit/2bd7f994fe04a2e17d0509cf157258ea9dddf386))
-  return condition according to isSelectable value of handleNodeClick ([d146586](https://github.com/taehunlim/react-diagram/commit/d14658653fea41f2c3e5a70c83e5c8ad16061371))
-  type error due to elementsSelectable in initialState ([fa00677](https://github.com/taehunlim/react-diagram/commit/fa00677245bad70ba6fdca67b41a2081cb7c4a0c))
-  type error in onError ([b11754e](https://github.com/taehunlim/react-diagram/commit/b11754ed5801a1200a7784fbaff13952385b1f2e))
-  type error in ZoomPane ([2f849c2](https://github.com/taehunlim/react-diagram/commit/2f849c2bd6ce26a6c380a487d927c62611bd04aa))

### Change Existing Behavior

-  onConnect work on mouseUp ([77265a7](https://github.com/taehunlim/react-diagram/commit/77265a74f5417f4cf4528ceb8cb3fa84d296e857))

### Code Refactoring

-  devWarn func ([b0de268](https://github.com/taehunlim/react-diagram/commit/b0de2683930e28e559b1556b6393e88e4084f5db))
-  eslint, lint-staged ([3b21783](https://github.com/taehunlim/react-diagram/commit/3b217832aee0290ff2e7e225e8c76070c2dc265a))
-  minZoom, maxZoom ([aca445d](https://github.com/taehunlim/react-diagram/commit/aca445dcd5b29a05ebb789df8a171f189247fb7a))
-  nodeExtent so that specified extent also apply to edge ([9187cda](https://github.com/taehunlim/react-diagram/commit/9187cdafab81a46c4d6d71850d29fcc9aa3b3c59))
-  root eslint ([a560fae](https://github.com/taehunlim/react-diagram/commit/a560fae941282f550104d3be49b7694d86ceafd2))
-  translateExtent ([94247f1](https://github.com/taehunlim/react-diagram/commit/94247f11a378bad24edbadc586f98cb883e61d32))
-  tsconfig ([96e26e1](https://github.com/taehunlim/react-diagram/commit/96e26e1e564ca90a5a9be6af8436cc74936bbdd8))
-  vite build option ([4a49b27](https://github.com/taehunlim/react-diagram/commit/4a49b2725193e4d123b49d94e1a77efec7dd21da))
-  vite migrration ([61e1517](https://github.com/taehunlim/react-diagram/commit/61e15170ff73db43b7dfa4194bdb4f7b8b2ebaeb))
-  ZoomPaneProps ([fa833cf](https://github.com/taehunlim/react-diagram/commit/fa833cf02bb834a3d42fff40e92d69fc012fc515))

### Adding Something

-  010 error message ([1e72297](https://github.com/taehunlim/react-diagram/commit/1e72297f880332129f6c1cd3a33c0fea351ed518))
-  addNode button ([e41b5d9](https://github.com/taehunlim/react-diagram/commit/e41b5d9a2a02b3cff8a500fd8be0d07b2727f597))
-  connection reset code to onPointerUp func ([606e72d](https://github.com/taehunlim/react-diagram/commit/606e72dd70023599a1b74ea6930521b6bcca9244))
-  connectionNodeId to store when doing onMouseDown Port ([d47d360](https://github.com/taehunlim/react-diagram/commit/d47d360d991a96cf4e0bb737702926a7b635ef40))
-  connectionPortType to store when doing onMouseDown Port ([406d592](https://github.com/taehunlim/react-diagram/commit/406d592238b828c15751195cae5de3202b74afdd))
-  connectionPosition to store ([50b5161](https://github.com/taehunlim/react-diagram/commit/50b51616e7ee627471fd9e687ba20be01b20eb9a))
-  const centerLineIsBent ([686adc8](https://github.com/taehunlim/react-diagram/commit/686adc89800bb094a408532ee5dc34dcad39500a))
-  d3Selection to store ([730d4dd](https://github.com/taehunlim/react-diagram/commit/730d4dd4504fc4a0999b622274acc29792b75cab))
-  data props into Node ([0662cbb](https://github.com/taehunlim/react-diagram/commit/0662cbb2777b3249a6cd1167f81d664624fc785d))
-  data-portpos, port type to Port for get handleBounds ([f4b36f6](https://github.com/taehunlim/react-diagram/commit/f4b36f6eb99da04de4cca91bddf86c25b4715feb))
-  dragging className to wrapNode ([ce6cf7e](https://github.com/taehunlim/react-diagram/commit/ce6cf7e37bba69b03de56794bd54582207b790a3))
-  error code to errorMessages to fix type error in onError ([d086f76](https://github.com/taehunlim/react-diagram/commit/d086f76ccbcf3c1f5fd77c57481b72c25cf17125))
-  errorMessages ([cd07afa](https://github.com/taehunlim/react-diagram/commit/cd07afa14161cc74848c857ad05392bbde266902))
-  eslint to root ([71efcc1](https://github.com/taehunlim/react-diagram/commit/71efcc1d64f9d9eb36de54eafe5f3d00ee18ec7f))
-  eslint-config ([5ef6805](https://github.com/taehunlim/react-diagram/commit/5ef680556e73cf54d6ef0a2cd5339cb74af91a1e))
-  event validation code to ZoomPane ([68d436e](https://github.com/taehunlim/react-diagram/commit/68d436e19191ef414aeae4dc0c75dad47abd93bc))
-  handleNodeClick in useDrag to change from click to drag start to add selected ([5e0a143](https://github.com/taehunlim/react-diagram/commit/5e0a14308874dc0a8bf2bb09205729930254c55c))
-  index.ts to packages ([b59ff85](https://github.com/taehunlim/react-diagram/commit/b59ff85636326b7ead478d95ce5f591375759cf5))
-  isDraggable to const hasPointerEvents in wrapNode to make node draggable without adding onNodeClick ([d410ac7](https://github.com/taehunlim/react-diagram/commit/d410ac73ce6693ef39c7d8ff53b9a6fe9249de61))
-  isExistsConnection func to addEdge maintain unique edge ([c65ebcd](https://github.com/taehunlim/react-diagram/commit/c65ebcdd38ff188ed0a49435652e1c18336b652f))
-  node hidden props ([8881acf](https://github.com/taehunlim/react-diagram/commit/8881acfad16e17fc72a0fd7e28f6849c2829bfc9))
-  nodesDraggable props ([07b4481](https://github.com/taehunlim/react-diagram/commit/07b448134f01ee30669e9c3da11bb44b2f66494e))
-  onConnect to StoreUpdate to get the node connected state ([18fdf68](https://github.com/taehunlim/react-diagram/commit/18fdf684482198c40358dbc173eb3d9d86e12def))
-  onConnectEnd event ([9d7f63c](https://github.com/taehunlim/react-diagram/commit/9d7f63cb9f39afc290404e6d2a3352c0e01ff5a8))
-  onConnectStart event ([3ac4e5a](https://github.com/taehunlim/react-diagram/commit/3ac4e5ab3c49aaf83479ce5e2d490bdc6951cc17))
-  package.json ([83c6106](https://github.com/taehunlim/react-diagram/commit/83c61068e59029113350962a20daf8e246d928d8))
-  postcss-config ([dffb8c0](https://github.com/taehunlim/react-diagram/commit/dffb8c00aeda6cc622eed2a01ac483e4f9554191))
-  React memo to DiagramView ([290b379](https://github.com/taehunlim/react-diagram/commit/290b3791b58d072d3f767d5bbcb70df1d399c9c5))
-  rollup-config ([94fb139](https://github.com/taehunlim/react-diagram/commit/94fb13911ee97421c7967a8347b1e9c6b421f86e))
-  set code to updateNode Dimensions to make nodes visible without adding onNodesChange to ReactDiagram on initial render ([81c7ed1](https://github.com/taehunlim/react-diagram/commit/81c7ed1e4091d81cae44c6b63e0dd56279576b33))
-  touch event to Port ([fe0313a](https://github.com/taehunlim/react-diagram/commit/fe0313a76e9ed73813c821aa8472f35f38c954cb))
-  tsconfig to packages ([4ce6458](https://github.com/taehunlim/react-diagram/commit/4ce64587bed1909ff25772a9da6db747ae737e0b))
-  updateNodePositions reset code when drag end ([ef897d0](https://github.com/taehunlim/react-diagram/commit/ef897d0a81dddbd04e2513ddccbcf2c0f176f3a3))
-  validation to ConnectionPath so that it only works when portType is source ([9718e33](https://github.com/taehunlim/react-diagram/commit/9718e33b46276aba1a1fd69ce78a16404b61c140))

### UI Styling

-  .react-diagram ([d7c0c13](https://github.com/taehunlim/react-diagram/commit/d7c0c132ec9bfee61487a1a9a8f8180aa31879a6))
-  add focus-visible to default node ([1fa7151](https://github.com/taehunlim/react-diagram/commit/1fa7151329fee298adbeb62f0405044c92f1bc87))
-  react-diagram\_\_container, containerStyle ([05fdcc7](https://github.com/taehunlim/react-diagram/commit/05fdcc7f0407106cdad0b0b9940922b8e44cb19d))
-  selected node style ([2e11ae2](https://github.com/taehunlim/react-diagram/commit/2e11ae2adf952cf51d1fb0fcb5925fedd673b783))
