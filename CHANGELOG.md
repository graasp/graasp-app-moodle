# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.4](https://github.com/graasp/graasp-app-moodle/compare/v0.1.3...v0.1.4) (2020-07-17)

### [0.1.3](https://github.com/graasp/graasp-app-moodle/compare/v0.1.2...v0.1.3) (2020-07-17)

### Bug Fixes

- environment variable definition '=' not ':' ([e57e6e8](https://github.com/graasp/graasp-app-moodle/commit/e57e6e8dad3e9901f6cfa1a8eb843702ea62f47e))
- path to encrypted env file ([1a1a168](https://github.com/graasp/graasp-app-moodle/commit/1a1a168efe39b1b70716c715f0ae6fb529e3661d))
- remove links attr ([e440f27](https://github.com/graasp/graasp-app-moodle/commit/e440f271ea17ddb85370467f2fb8d7f011b63179))
- update paths and names in docker-compose ([904de4f](https://github.com/graasp/graasp-app-moodle/commit/904de4fc19579e1c21e6153689c28996b7dfc9d2))
- updated env variable names ([e7753bd](https://github.com/graasp/graasp-app-moodle/commit/e7753bd3a4531ed81288868905e4b313cecb46f8))
- upgrade node packages ([7c127e3](https://github.com/graasp/graasp-app-moodle/commit/7c127e3a8460ed7d2259d82f746b295ca220a6f6))

### Tests

- define moodle and app url through env ([e966472](https://github.com/graasp/graasp-app-moodle/commit/e966472f1b63ce227a396235c79b157d7606073d))
- enable all tests again ([2ba1698](https://github.com/graasp/graasp-app-moodle/commit/2ba16985989611f49fb3e2abecd5c33d1fca2d0b))
- initial setup for codeship ([6bb7db8](https://github.com/graasp/graasp-app-moodle/commit/6bb7db88d7a4683214b45e2d1688d071c39d3186))
- remove extra browser ([87ea32a](https://github.com/graasp/graasp-app-moodle/commit/87ea32af8ead5b80ac2418e41a6ad6cedb6d4048))
- remove obsolete code ([751abd8](https://github.com/graasp/graasp-app-moodle/commit/751abd89240c36e4e404eaea91d3dcea393b3a76))
- remove test that fails in pipeline ([c54d8fd](https://github.com/graasp/graasp-app-moodle/commit/c54d8fdc05296e5b8a12a1b90021fc7ab5e565b7))
- skip not working tests temporarly ([a408cba](https://github.com/graasp/graasp-app-moodle/commit/a408cbac5ff44a4f118f7978af16c3049735d452))

### Continuous Integration

- add deployments for master and new tags ([d5f2c7b](https://github.com/graasp/graasp-app-moodle/commit/d5f2c7b8ce83a17317a2f8558a3a6e396eac7cc0))
- add encrypted aws keys for app ([4e3b540](https://github.com/graasp/graasp-app-moodle/commit/4e3b540a7e0e53b6992394bc92f23ab35e66eeb4))
- add healtchecks and adjust networking ([07c80ff](https://github.com/graasp/graasp-app-moodle/commit/07c80ff5d696e98561b69f74b2a931cf54836d77))
- add healthckeck to db ([cb8e0e4](https://github.com/graasp/graasp-app-moodle/commit/cb8e0e430e59e8379d8c697a44c302bbbe2ec233))
- add manual dependency for wait-on ([7d0a1ea](https://github.com/graasp/graasp-app-moodle/commit/7d0a1ea18b2f86289f01aee0813b415fe3fb0719))
- change app service to domain name ([4a46f25](https://github.com/graasp/graasp-app-moodle/commit/4a46f25ac2ea88e7883a05a4b1a00eb9f735d671))
- change app url for test ([37b8c17](https://github.com/graasp/graasp-app-moodle/commit/37b8c17d8e6022b5964e5874330f1d53fb7d64db))
- disable video and update env var in run cmd ([17e778c](https://github.com/graasp/graasp-app-moodle/commit/17e778c8afa25ce23b2c34bbe6e8b08d34eb150c))
- enable lint and jest unit tests ([8dd86fd](https://github.com/graasp/graasp-app-moodle/commit/8dd86fdb6a7c4e64cebd5c18b2f73d390054304e))
- increase healthcheck retries and timeout ([fcff2a9](https://github.com/graasp/graasp-app-moodle/commit/fcff2a97e057e3a8553757e4e770b69b984c2988))
- pre-install node modules and use node-slim ([ab18a3c](https://github.com/graasp/graasp-app-moodle/commit/ab18a3ca575147fcfc9e64809482461b5227b553))
- remove 'sudo' from dockerfile ([a8fe246](https://github.com/graasp/graasp-app-moodle/commit/a8fe2462134d4dc74161f9f658256daf178717db))
- remove obsole 'run' par of command ([9667bbb](https://github.com/graasp/graasp-app-moodle/commit/9667bbb61330f4f11140154cfd54a6279dd82548))
- replace run command ([ff531f1](https://github.com/graasp/graasp-app-moodle/commit/ff531f1632c5d0f1a188a341be3c2fffce36fe6c))
- run cypress from within app container ([13faede](https://github.com/graasp/graasp-app-moodle/commit/13faede0e99c5b6035f08d811b015355697a180c))
- security error change domain property ([ca11085](https://github.com/graasp/graasp-app-moodle/commit/ca110851244fe59113efb35c2443f1a365fc80c9))
- try exposing the graasp apps port ([7a92457](https://github.com/graasp/graasp-app-moodle/commit/7a92457a5abae362268b5610a1c760e50299ed24))
- try out wait-on and fail ([a41f08b](https://github.com/graasp/graasp-app-moodle/commit/a41f08b56d11b9adfa1d1b6a189eb4b9d38fb0aa))
- try to run 2 commands on same container ([ec0b4bc](https://github.com/graasp/graasp-app-moodle/commit/ec0b4bc61df56c9001581dec7102bdd05a086ee8))
- update start command for ci ([396fc5e](https://github.com/graasp/graasp-app-moodle/commit/396fc5e21ff99752b20a724b5eada87c9597164a))
- use chromium for tests ([9bd18b5](https://github.com/graasp/graasp-app-moodle/commit/9bd18b5bbc9d9e0a4b89212aca6f93a88333c22a))
- working local version for exec 'yarn try:ssat' ([11607fa](https://github.com/graasp/graasp-app-moodle/commit/11607fad90078b6fc93f21e8430b57937cc699d8))

### [0.1.2](https://github.com/graasp/graasp-app-moodle/compare/v0.1.1...v0.1.2) (2020-07-13)

### Features

- add default pw ([b29971e](https://github.com/graasp/graasp-app-moodle/commit/b29971e9ee1721a8d3efe11fc55116cb68f800df))
- add docker containers ([d058907](https://github.com/graasp/graasp-app-moodle/commit/d058907c7a6331c83f58d74b7af22555c268a126))
- disable save filtered button when none ([e5bbd33](https://github.com/graasp/graasp-app-moodle/commit/e5bbd33f09e0b0a490a2547d77601ecb17e2fd3a))
- display loader when requests are sent ([995614f](https://github.com/graasp/graasp-app-moodle/commit/995614f9b0518d0dce8382cb4bcd43d3d02a410e))
- enable test runs and save results ([1d1e482](https://github.com/graasp/graasp-app-moodle/commit/1d1e482b635b380561df67bb2ca59e8ac60e0820))
- load available columns dynamically from data ([40d6a8b](https://github.com/graasp/graasp-app-moodle/commit/40d6a8b3d90c166715b661d6c2c81ae490699828))
- show info about required plugin in settings ([ed57b1d](https://github.com/graasp/graasp-app-moodle/commit/ed57b1dda32b9c34f74844a3afb7e6416af3734a))

### Bug Fixes

- add missing /^to query string ([0240618](https://github.com/graasp/graasp-app-moodle/commit/0240618e37710593e09279d924405738e598a684))
- remove password in clear from storage ([ab90a6e](https://github.com/graasp/graasp-app-moodle/commit/ab90a6e0433b47aa167635534fee16746c8bfc6b))
- rename the title in the header to "moodle" ([6992886](https://github.com/graasp/graasp-app-moodle/commit/699288630d517cce0cf4f362cb1b7a909f53aa40))
- shorten url to moodle plugin ([13ebd37](https://github.com/graasp/graasp-app-moodle/commit/13ebd37ba9b46b6a2ea0e44537f527f97c7eafd7))
- typoe in label ([743c63c](https://github.com/graasp/graasp-app-moodle/commit/743c63ccbbe03775c101ac128bc3b4f56879b080))

### Tests

- save buttons disabled states ([8f04f94](https://github.com/graasp/graasp-app-moodle/commit/8f04f94d0c9e7d4cf89d6277ab882af8e3a791c7))

### [0.1.1](https://github.com/graasp/graasp-app-moodle/compare/v0.1.0...v0.1.1) (2020-07-06)

### Features

- implement strategy pattern ([eace5cf](https://github.com/graasp/graasp-app-moodle/commit/eace5cfe5501f16b7bf90afd40847feecc8b34ee))
- save filtered data ([8138a7a](https://github.com/graasp/graasp-app-moodle/commit/8138a7a7fd556adba53d87e712c2b2e2918d37c1))
- store if data is filtered or not ([430dade](https://github.com/graasp/graasp-app-moodle/commit/430dade9139c083c4fa91c660f1e769f2e4e3bec))

### Bug Fixes

- add extra line at end of file ([88e532d](https://github.com/graasp/graasp-app-moodle/commit/88e532d59d2cf5940d7dd2b685283c4208618f85))
- add missing param to abstract method ([332a09a](https://github.com/graasp/graasp-app-moodle/commit/332a09a67ba561c88fdbe3b48522c35f69a68635))
- add unique key to jsx loop element ([dd27458](https://github.com/graasp/graasp-app-moodle/commit/dd274582e1b9966bdae2a8a0bd8b99e62dc6bce3))
- changing default selected values autocomplete ([7c3615b](https://github.com/graasp/graasp-app-moodle/commit/7c3615b135733f7aefcb36948c55a3f7ec91efd7))
- conver timecreated only if exist ([367de62](https://github.com/graasp/graasp-app-moodle/commit/367de62d2f4d6b6fac87ea8d65a7b581e8e7a734))
- delay deletion of resources until loaded ([8f292cd](https://github.com/graasp/graasp-app-moodle/commit/8f292cdf42300a86f07c77e20609d66ec56ac29b))
- ignore only cypress examples ([9ee53eb](https://github.com/graasp/graasp-app-moodle/commit/9ee53eb51f9a01dc6805f5235a997d138eedf9a7))
- implement feedback on merge request ([009356c](https://github.com/graasp/graasp-app-moodle/commit/009356c6dbc3fd729c0e0ea982055d360286dc28))
- merge branch 'master' into dev ([cb5ce5b](https://github.com/graasp/graasp-app-moodle/commit/cb5ce5bffe7aa86688f1dbc83bbc86930e7119dd))
- prevent loader and rerender of component ([7d806c6](https://github.com/graasp/graasp-app-moodle/commit/7d806c6f2a178fad2b79fd8cd5e3c43e91aa55b6))
- remove default values for connection in store ([34454c8](https://github.com/graasp/graasp-app-moodle/commit/34454c82ced5b52787395da7f11e71389f8251f4))
- remove the timecreated filter ([db189f9](https://github.com/graasp/graasp-app-moodle/commit/db189f94ba79d7c4df394cb3ed1bb8e27f870dde))
- rename displayed app title ([a9a5c3d](https://github.com/graasp/graasp-app-moodle/commit/a9a5c3d6a46146603bc53e147b5fcbc47c6b4c60))
- rename table labels ([718bd67](https://github.com/graasp/graasp-app-moodle/commit/718bd67b91845b4a9a2f565b57dcf64d4808090e))
- spelling in a comment ([10d440a](https://github.com/graasp/graasp-app-moodle/commit/10d440aa115051686f382afe70ac22ec61ec9ea9))
- update node packages ([875cd3d](https://github.com/graasp/graasp-app-moodle/commit/875cd3dcba89ebe307dfde044187b48c5736125f))
- update scripts for deployment ([2333d4f](https://github.com/graasp/graasp-app-moodle/commit/2333d4f3da5abf50dc3a053f7e5748201c7a399c))

### Tests

- delete saved resource again ([1da5f4c](https://github.com/graasp/graasp-app-moodle/commit/1da5f4c59d9a4770505c3606710384ffb0128dbe))

### Documentation

- update getCourseData() description ([aa162f7](https://github.com/graasp/graasp-app-moodle/commit/aa162f7d4641b860ba851c4eb1cd52cf996e07d4))
- update method description ([398a88b](https://github.com/graasp/graasp-app-moodle/commit/398a88b92098eaa83f77e1620ba387d2994aa335))

## 0.1.0 (2020-06-30)

### Features

- add filters for courses and users ([d98c014](https://github.com/graasp/graasp-app-moodle/commit/d98c014db12e733a9d024a85525812d36fe4743d))
- basic filter options for action and targets ([c171dfb](https://github.com/graasp/graasp-app-moodle/commit/c171dfb97f04154d2c28cd528d77ac27b00d9fa6))
- display moodle related setting fields ([559c03a](https://github.com/graasp/graasp-app-moodle/commit/559c03a9f856e28dc90e917e9de3f7cd26981301))
- fetch available courses ([4f67836](https://github.com/graasp/graasp-app-moodle/commit/4f67836e0eb092a51215b5fc45b0e51bbf50dfec))
- fetch moodle token (hardcoded) ([1e70fd4](https://github.com/graasp/graasp-app-moodle/commit/1e70fd4730aa754587488228d3e2256c49f7cc76))
- fetch multiple courses at once ([a004998](https://github.com/graasp/graasp-app-moodle/commit/a004998e581f0e8b4ec85b2474098fc197bdc08b))
- handle wrong login credentials ([afc304a](https://github.com/graasp/graasp-app-moodle/commit/afc304aeb5d629b20a2ef6c674477986207368d1))
- render available courses after request ([95b135a](https://github.com/graasp/graasp-app-moodle/commit/95b135af2147a2aa390fd25f4f6b73e9914ac116))
- select columns to display ([6150f41](https://github.com/graasp/graasp-app-moodle/commit/6150f41c94c9f800c908c740180666ce43e5909d))
- store data source url in appinstanceresource ([5fc3e35](https://github.com/graasp/graasp-app-moodle/commit/5fc3e35dc0fde6b71e3e192ce0af6293d4069760))
- store moodle settings in global store + api ([400f40b](https://github.com/graasp/graasp-app-moodle/commit/400f40b42de798a48135eeae186be3ad72d997d6))

### Bug Fixes

- display all rows when ...Filter = [](<[1277c2c](https://github.com/graasp/graasp-app-moodle/commit/1277c2c1c8b5988c9362557b6a011fb7262c3bf4)>)
- spelling errors ([4ab93a2](https://github.com/graasp/graasp-app-moodle/commit/4ab93a25910ba1af4cc4db0a255c7ddc9c31293b))
- update moodle web service names ([a6d3bb1](https://github.com/graasp/graasp-app-moodle/commit/a6d3bb1ae8d7c587cb238b9da5c8d3319e601b1f))
- use array access for columns ([5ac1b1e](https://github.com/graasp/graasp-app-moodle/commit/5ac1b1edf7c147f3e6d4cb9b791910bc72ecbb76))

# Change Log
