## [3.6.6](https://github.com/neovici/cosmoz-data-nav/compare/v3.6.5...v3.6.6) (2021-01-28)


### Bug Fixes

* read id from hash param only when we we never read it or maintainSelection is tru ([a6cfd4a](https://github.com/neovici/cosmoz-data-nav/commit/a6cfd4a79292e692e0acc5dc2c30bbba2425da03))

## [3.6.5](https://github.com/neovici/cosmoz-data-nav/compare/v3.6.4...v3.6.5) (2020-10-29)


### Bug Fixes

* check undefined inst in _toggleInstance ([358d466](https://github.com/neovici/cosmoz-data-nav/commit/358d4663b8d5d9daab2b32628638c1e633485d2e))

## [3.6.4](https://github.com/neovici/cosmoz-data-nav/compare/v3.6.3...v3.6.4) (2020-10-15)


### Bug Fixes

* upgrade cosmoz-bottom-bar ([9bac932](https://github.com/neovici/cosmoz-data-nav/commit/9bac9329edb040e7e038bfbe6374c4bb43d2855b))

## [3.6.3](https://github.com/neovici/cosmoz-data-nav/compare/v3.6.2...v3.6.3) (2020-10-05)


### Bug Fixes

* remove iron-resizable-behavior ([5b26b77](https://github.com/neovici/cosmoz-data-nav/commit/5b26b77d601e54e8b2d1fd5a45daae047944639e))

## [3.6.2](https://github.com/neovici/cosmoz-data-nav/compare/v3.6.1...v3.6.2) (2020-08-27)


### Bug Fixes

* correct resizable handle ([0d84ae6](https://github.com/neovici/cosmoz-data-nav/commit/0d84ae69a5869ac4a84209663b79232ff20b6de8))

## [3.6.1](https://github.com/neovici/cosmoz-data-nav/compare/v3.6.0...v3.6.1) (2020-07-23)


### Bug Fixes

* **renderItem:** iron-lists inside data-nav views do not re-render ([851c614](https://github.com/neovici/cosmoz-data-nav/commit/851c6149b3ecc10ed4495f469ba16e0c56ed0565))

# [3.6.0](https://github.com/neovici/cosmoz-data-nav/compare/v3.5.0...v3.6.0) (2020-06-25)


### Bug Fixes

* add renderItem test, fix renderItem teardown ([cb51ae6](https://github.com/neovici/cosmoz-data-nav/commit/cb51ae691a6274a2e0f850ed9def1b04c63e664c))
* make sure to only _forwardHostProp on instance templates ([dc59194](https://github.com/neovici/cosmoz-data-nav/commit/dc5919467708b46074c0b6d4de84292928f4e77c))


### Features

* renderItem: render templates with lit-html ([fc10bdf](https://github.com/neovici/cosmoz-data-nav/commit/fc10bdfdad5883aea34911ef62cfa7a4e70fe3da))

# [3.5.0](https://github.com/neovici/cosmoz-data-nav/compare/v3.4.4...v3.5.0) (2020-06-24)


### Bug Fixes

* don't nest useMemo ([06915c6](https://github.com/neovici/cosmoz-data-nav/commit/06915c613e647b80229b405b75c416c549e8eb3b))
* reorganize imports/deps, drop translatable mixin ([597748b](https://github.com/neovici/cosmoz-data-nav/commit/597748b3b818b04baf5b54891c29d59814f6ed44))


### Features

* use haunted to manage incomplete templates ([fac0c2b](https://github.com/neovici/cosmoz-data-nav/commit/fac0c2b15f4204fab2a81f1517c39cc63aea99b8))

## [3.4.4](https://github.com/neovici/cosmoz-data-nav/compare/v3.4.3...v3.4.4) (2020-06-23)


### Bug Fixes

* correct placement of next/prev in incomplete items ([aac4119](https://github.com/neovici/cosmoz-data-nav/commit/aac4119868e43a5a225d14010375715ee60273a0))

## [3.4.3](https://github.com/neovici/cosmoz-data-nav/compare/v3.4.2...v3.4.3) (2020-06-22)


### Bug Fixes

* incomplete instance styling ([25ec6c4](https://github.com/neovici/cosmoz-data-nav/commit/25ec6c4dc95d2493c2eb3e03f98f64b1050bafe9))

## [3.4.2](https://github.com/neovici/cosmoz-data-nav/compare/v3.4.1...v3.4.2) (2020-06-22)


### Bug Fixes

* drop iron-flex-layout ([317b71d](https://github.com/neovici/cosmoz-data-nav/commit/317b71d9bb0f03396119097bd8b2baa53829f000))

## [3.4.1](https://github.com/neovici/cosmoz-data-nav/compare/v3.4.0...v3.4.1) (2020-06-19)


### Bug Fixes

* **build:** publish lib/ to npm package ([978f38d](https://github.com/neovici/cosmoz-data-nav/commit/978f38d5b6c26b36844e5fd2340dbdbed3819599))

# [3.4.0](https://github.com/neovici/cosmoz-data-nav/compare/v3.3.3...v3.4.0) (2020-06-18)


### Features

* **👻:** extract cache behavior with haunted-polymer hook ([#120](https://github.com/neovici/cosmoz-data-nav/issues/120)) ([126aeac](https://github.com/neovici/cosmoz-data-nav/commit/126aeac1e093f3ff7e95b01511d8755b8d25ba0b))

## [3.3.3](https://github.com/neovici/cosmoz-data-nav/compare/v3.3.2...v3.3.3) (2020-06-18)


### Bug Fixes

* make sure selected instance isn't updated for preloads ([957354b](https://github.com/neovici/cosmoz-data-nav/commit/957354b011adead47126a4027cc9cda382f451dc))

## [3.3.2](https://github.com/neovici/cosmoz-data-nav/compare/v3.3.1...v3.3.2) (2020-06-17)


### Bug Fixes

* **test:** drop selectedInstance bug tests 🎉 ([2ff6a26](https://github.com/neovici/cosmoz-data-nav/commit/2ff6a26dd93784f80fc4c1ce26110163f7708c8b))
* update selected instance after rendering ([30d7a93](https://github.com/neovici/cosmoz-data-nav/commit/30d7a93aa8370a447ab08bf30c1d1a8d3f6249f8))

## [3.3.1](https://github.com/neovici/cosmoz-data-nav/compare/v3.3.0...v3.3.1) (2020-06-11)


### Bug Fixes

* **selected-instance:** is always the incomplete template ([b570511](https://github.com/neovici/cosmoz-data-nav/commit/b5705114ef3b634aebae81c94b318f656c5a0e8a))

# [3.3.0](https://github.com/neovici/cosmoz-data-nav/compare/v3.2.0...v3.3.0) (2020-04-15)


### Bug Fixes

* drop old comment and notifyProp prop, rename visibility fixture ([111e122](https://github.com/neovici/cosmoz-data-nav/commit/111e1228a2ad0b706ddd2fd4a95a7f7553111d03))
* **test:** reuse need-request tests logic, fix false passes, speed up ([05d4662](https://github.com/neovici/cosmoz-data-nav/commit/05d4662028a7c1dbd795bdca044c37a453111e6a))
* _getInstance and selectedInstance old logic ([c2908eb](https://github.com/neovici/cosmoz-data-nav/commit/c2908eb4d6f726d4ae1eb3c3dc45865964b917a3))
* reuse getItems, setupFixture, add tests, add bug tests ([6bf06a9](https://github.com/neovici/cosmoz-data-nav/commit/6bf06a97152a75ec7346458e2e1abb91384fb9c9))
* **test:** add test for [#117](https://github.com/neovici/cosmoz-data-nav/issues/117) ([c251fbc](https://github.com/neovici/cosmoz-data-nav/commit/c251fbcd76f6150ba9477fe43a56a850eec9ad3b))
* **test:** port spec tests to karma ([2f92a9f](https://github.com/neovici/cosmoz-data-nav/commit/2f92a9f142fa7097d11133c9368f2ac303a89462))
* **test:** reuse more logic ([5688863](https://github.com/neovici/cosmoz-data-nav/commit/568886378821969b2b7e6ea4f89375efe95e0315))
* repo upgrade ([174cdd4](https://github.com/neovici/cosmoz-data-nav/commit/174cdd43bc8022d5cded2ddc019f0b011d1fe400))
* reuse code to avoid duplication (code climate) ([0f6f38d](https://github.com/neovici/cosmoz-data-nav/commit/0f6f38d0b11249e86d6faaff7b5b22d30b57bb31))
* update demo, add (now working?) spec test ([59c269e](https://github.com/neovici/cosmoz-data-nav/commit/59c269e382dc8392e2a5ec655c97eb780fbd9735))


### Features

* configurable data request parallelization ([13a284a](https://github.com/neovici/cosmoz-data-nav/commit/13a284a1d8eb26983b56a9b51b4e40f1fefaed69))

# [3.2.0](https://github.com/neovici/cosmoz-data-nav/compare/v3.1.0...v3.2.0) (2020-03-17)


### Features

* extend error message details ([#112](https://github.com/neovici/cosmoz-data-nav/issues/112)) ([602ac7c](https://github.com/neovici/cosmoz-data-nav/commit/602ac7c83ba4cbe52d751a6717b103844fe2ee3a))

# [3.1.0](https://github.com/neovici/cosmoz-data-nav/compare/v3.0.8...v3.1.0) (2020-03-16)


### Features

* upgrade to cosmoz-page-router@^6.0.0 ([a8bce56](https://github.com/neovici/cosmoz-data-nav/commit/a8bce568e202d44182f688805e95e034247da7af))

## [3.0.8](https://github.com/neovici/cosmoz-data-nav/compare/v3.0.7...v3.0.8) (2020-03-16)


### Bug Fixes

* handle dom-if in _isDescendantOfElementInstance ([408b258](https://github.com/neovici/cosmoz-data-nav/commit/408b25812addf7b9ee117e3b5d9dc5d3035ae0b0))

## [3.0.7](https://github.com/neovici/cosmoz-data-nav/compare/v3.0.6...v3.0.7) (2020-01-08)


### Bug Fixes

* refactor selectedInstance and selectedElement notification ([c655e56](https://github.com/neovici/cosmoz-data-nav/commit/c655e56841b5296fc9a9c994af576900e0b1fc5c)), closes [#106](https://github.com/neovici/cosmoz-data-nav/issues/106)

## [3.0.6](https://github.com/neovici/cosmoz-data-nav/compare/v3.0.5...v3.0.6) (2019-10-31)


### Bug Fixes

* 🐛 data-nav related props are not updated when realigned ([3449d62](https://github.com/neovici/cosmoz-data-nav/commit/3449d62))
* do not update instance if it was realigned ([7cc1b8d](https://github.com/neovici/cosmoz-data-nav/commit/7cc1b8d)), closes [#90](https://github.com/neovici/cosmoz-data-nav/issues/90)

## [3.0.5](https://github.com/neovici/cosmoz-data-nav/compare/v3.0.4...v3.0.5) (2019-10-10)


### Bug Fixes

* **deps:** update dependencies ([080873e](https://github.com/neovici/cosmoz-data-nav/commit/080873e))

## [3.0.4](https://github.com/neovici/cosmoz-data-nav/compare/v3.0.3...v3.0.4) (2019-10-07)


### Bug Fixes

* **ci:** upgrade to semantic-release ([fa01f58](https://github.com/neovici/cosmoz-data-nav/commit/fa01f58))
