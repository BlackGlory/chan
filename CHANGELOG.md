# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.4](https://github.com/BlackGlory/chan/compare/v0.3.3...v0.3.4) (2021-07-13)


### Bug Fixes

* close unexhausted iterators ([bb849ec](https://github.com/BlackGlory/chan/commit/bb849ecb40d89495174700097ab62b5278857a32))

### [0.3.3](https://github.com/BlackGlory/chan/compare/v0.3.2...v0.3.3) (2021-07-12)

### [0.3.2](https://github.com/BlackGlory/chan/compare/v0.3.1...v0.3.2) (2021-07-03)

### [0.3.1](https://github.com/BlackGlory/chan/compare/v0.3.0...v0.3.1) (2021-06-21)


### Features

* add /health ([9822041](https://github.com/BlackGlory/chan/commit/9822041d7be5b5b376009f89798b25c0541876ef))


### Bug Fixes

* docker build ([4db026a](https://github.com/BlackGlory/chan/commit/4db026a0dcb89b5a995985befe5b94cca1ecdde5))
* docker build ([879b11a](https://github.com/BlackGlory/chan/commit/879b11ab70f7e2630721aea27e884826b6e97155))

## [0.3.0](https://github.com/BlackGlory/chan/compare/v0.2.1...v0.3.0) (2021-04-27)


### ⚠ BREAKING CHANGES

* database schema has been upgraded.

* rename ([5854a33](https://github.com/BlackGlory/chan/commit/5854a3378392e4635761efe4a4adb1714f4c520d))

### [0.2.1](https://github.com/BlackGlory/chan/compare/v0.2.0...v0.2.1) (2021-03-17)

## 0.2.0 (2021-03-14)


### ⚠ BREAKING CHANGES

* rename /api to /admin
* /stats => /metrics
* the database needs to be rebuilt.
* database needs to be rebuilt
* CHAN_TOKEN_REQUIRED => CHAN_WRITE_TOKEN_REQUIRED
CHAN_TOKEN_REQUIRED => CHAN_READ_TOKEN_REQUIRED
* CHAN_DISABLE_NO_TOKENS => CHAN_TOKEN_REQUIRED
* MPMC => Chan
* enqueue permission => write permission
dequeue permission => read permission
* /data/database.sqlite => /data/config.db
* MPMC_JSON_SCHEMA_VALIDATION => MPMC_JSON_VALIDATION
* MPMC_JSON_SCHEMA => MPMC_DEFAULT_JSON_SCHEMA
MPMC_JSON_ONLY => MPMC_JSON_PAYLOAD_ONLY
* refactor routes of token-based access control
* PORT => MPMC_PORT
HOST => MPMC_HOST
ADMIN_PASSWORD => MPMC_ADMIN_PASSWORD
LIST_BASED_ACCESS_CONTROL => MPMC_LIST_BASED_ACCESS_CONTROL
TOKEN_BASED_ACCESS_CONTROL => MPMC_TOKEN_BASED_ACCESS_CONTROL
DISABLE_NO_TOKENS => MPMC_DISABLE_NO_TOKENS
HTTP2 => MPMC_HTTP2

### Features

* add /stats ([f0d1990](https://github.com/BlackGlory/chan/commit/f0d19903ffe2f0eecb6c43955561427906c36127))
* add api routes ([8624957](https://github.com/BlackGlory/chan/commit/862495773e17b9ca3bcf1391dafab5b1c3445793))
* add blacklist, whitlist DAO ([bff164e](https://github.com/BlackGlory/chan/commit/bff164ee79a933a4cb2891c7bbeae3e9b5e8fe2e))
* add Dockerfile ([662347a](https://github.com/BlackGlory/chan/commit/662347a304f95c588a27d965cc753bd4f746a9ec))
* add indexes ([5993f7d](https://github.com/BlackGlory/chan/commit/5993f7d305a1f9fda11bb476a0e1f24d398cbd9e))
* add json schema api routes ([7f380d6](https://github.com/BlackGlory/chan/commit/7f380d60f36ab94ad0d946917dd442765fa8ce68))
* add matchEnqueueToken, matchDequeueToken ([44be605](https://github.com/BlackGlory/chan/commit/44be605c1b0f27542ad2693f0e5b93248588f96c))
* add MPMC_JSON_SCHEMA_VALIDATION ([c0c1cbb](https://github.com/BlackGlory/chan/commit/c0c1cbb9c0b5d820e2efd0b0d54d7a104f4195ed))
* add permission default constraints ([d27f858](https://github.com/BlackGlory/chan/commit/d27f8583b193dae078b99b6137080c666c4a4527))
* add permission default constraints ([8a3f6b5](https://github.com/BlackGlory/chan/commit/8a3f6b5a2bcd7af980a68bb4d25c5856adb52d6b))
* add prefix for environment variables ([b0c5653](https://github.com/BlackGlory/chan/commit/b0c565319506038679f85f7bd54d7c9ec5149b57))
* add pubsub based on SSE ([d929caa](https://github.com/BlackGlory/chan/commit/d929caa1677286c0d04d0c6813e40199cde63eb6))
* add robots.txt ([a9f705e](https://github.com/BlackGlory/chan/commit/a9f705e82a32b990f7d95b43e882d3983e5b21eb))
* add TokenPolicyDAO ([7a564f4](https://github.com/BlackGlory/chan/commit/7a564f4fb2ca1ec7959e2153d9099a05356b51ab))
* auto vacuum ([775653e](https://github.com/BlackGlory/chan/commit/775653e9b91583fee0d1cad8b3810be5923f1aad))
* custom ajv options ([a6dbada](https://github.com/BlackGlory/chan/commit/a6dbadac9adf55ba58652c421bdbbf33d99c4156))
* disable auto_vacuum ([bcbd7a7](https://github.com/BlackGlory/chan/commit/bcbd7a76b194a846e4b1bcc3eafc7ddeedf7f900))
* ensure data dir ([a4f2973](https://github.com/BlackGlory/chan/commit/a4f2973ec69b74902c4f82a431af89504b1114ef))
* handle SIGHUP ([099f30f](https://github.com/BlackGlory/chan/commit/099f30fed6de7473befaf8865acfc09851dea02c))
* improve behavior about content-type ([d7db2a6](https://github.com/BlackGlory/chan/commit/d7db2a698eb3006d83917a56f6b02e948d599bb3))
* improve content-type schema ([714e8d1](https://github.com/BlackGlory/chan/commit/714e8d1d73baec050ecaf64fba3f821f0bcae737))
* improve content-type validation ([eb0623a](https://github.com/BlackGlory/chan/commit/eb0623a5ef5b432c0fb199a3a33ae4203ecc2ebd))
* improve json validation ([a1cd42a](https://github.com/BlackGlory/chan/commit/a1cd42ae47bcd40ea8cd932e29e22fa76fa5fdd6))
* memoize environments ([91a0926](https://github.com/BlackGlory/chan/commit/91a092613e0a2df801bed195c3c718e1dfbacf65))
* more explicit errors ([200d9ea](https://github.com/BlackGlory/chan/commit/200d9eaaca84ba740d20e24de3906b745251d4c1))
* oneOf => anyOf ([08f2bcf](https://github.com/BlackGlory/chan/commit/08f2bcfbe0c17851d41bda5ac43e38df70114a0a))
* prometheus metrics ([27fbaf0](https://github.com/BlackGlory/chan/commit/27fbaf0ba3b512c565dcf9cb09a2f57bc679cb34))
* proof of concept ([e3fd059](https://github.com/BlackGlory/chan/commit/e3fd059d7391ef7b76f49b35515cab4ffbbb1332))
* remove indexes ([2bfd236](https://github.com/BlackGlory/chan/commit/2bfd2369e8ff1157bc63a7732115e3bc390d0681))
* rename /api to /admin ([54d1ded](https://github.com/BlackGlory/chan/commit/54d1ded967431b84dbe157eda9b0df151c994d6d))
* rename stats to metrics ([6f91d39](https://github.com/BlackGlory/chan/commit/6f91d394af599cc3a1c1601577f33c5cd5ac4ddb))
* split CHAN_TOKEN_REQUIRED ([b6e8032](https://github.com/BlackGlory/chan/commit/b6e8032157dd66c49e7e65988c09ac4cc8983acb))
* support CHAN_DATA ([21c7f26](https://github.com/BlackGlory/chan/commit/21c7f2633196bfb2e8549c38404f7791fa715177))
* support http2 ([63f0ac2](https://github.com/BlackGlory/chan/commit/63f0ac255d15aaa010953b78dc849b004706854d))
* support list-based access control ([2d21e59](https://github.com/BlackGlory/chan/commit/2d21e597d57b4967f58802f9fbfa4128a3c700bc))
* support MPMC_JSON_ONLY ([9aba181](https://github.com/BlackGlory/chan/commit/9aba1819b3aa618926899adb633fb668e6a52c2b))
* support PAYLOAD_LIMIT, ENQUEUE_PAYLOAD_LIMIT ([8fe03a9](https://github.com/BlackGlory/chan/commit/8fe03a96b0c131d1988b8d25b0f1cb0809d2e2df))
* support pm2 ([f4802be](https://github.com/BlackGlory/chan/commit/f4802beeedfd9180e3269199b79fc4b8e0c1e96d))
* support schema migration ([13df4cb](https://github.com/BlackGlory/chan/commit/13df4cb05365c1823601e110447e832c7520443e))
* support setting json schema ([6fc3da7](https://github.com/BlackGlory/chan/commit/6fc3da7fbebf05b5279d2439a50699f40da1ff27))
* support setting json schema specific to id ([e010842](https://github.com/BlackGlory/chan/commit/e01084244c43297d19d7e75b719e75f7c58c564f))
* support token-based access control ([a0586f2](https://github.com/BlackGlory/chan/commit/a0586f2860eb75826ce1d3133c2b1ca9477e349e))
* test response schemas ([32f2547](https://github.com/BlackGlory/chan/commit/32f254769780b9976144aa3a425c0cd4e77aa22f))
* token-based access control DAO ([d731de3](https://github.com/BlackGlory/chan/commit/d731de32d135bcffa8c4cf87f8af5625022eb42c))
* update schemas ([c22ec41](https://github.com/BlackGlory/chan/commit/c22ec41852c1135210d3550ed587d80abd9634af))
* upgrade Core.TBAC ([0d26258](https://github.com/BlackGlory/chan/commit/0d26258ecc26613f41fd73cb0aead63b99df54c1))
* upgrade e2e tests for token-based access control ([51c52a3](https://github.com/BlackGlory/chan/commit/51c52a37a9317e07c5e85ca1ab971e5602d8d2d9))


### Bug Fixes

* docker build ([27fde8c](https://github.com/BlackGlory/chan/commit/27fde8cb912edc869e47076199ea0a2f8f622cb0))
* docker build ([fedae9f](https://github.com/BlackGlory/chan/commit/fedae9f7118e8bfb96e318cc626220228bfa3fe1))
* examples ([729ab91](https://github.com/BlackGlory/chan/commit/729ab914f808c3c2e22741b1bd8503f788efe3ce))
* port ([d74990c](https://github.com/BlackGlory/chan/commit/d74990c0ac8c2837f211f3cb07eb6a3398a40591))
* process.on ([99abb05](https://github.com/BlackGlory/chan/commit/99abb056ae7f21f85c6571773560264bf1ad2b86))
* schema ([b82ff17](https://github.com/BlackGlory/chan/commit/b82ff171d55f35c041627625cddf7bc10fe6a3cb))
* start server ([ad7ab5b](https://github.com/BlackGlory/chan/commit/ad7ab5b2a5be84029929dfb15e1c8bebe33a3d48))
* tests ([f59e0f6](https://github.com/BlackGlory/chan/commit/f59e0f67966966451d2b13d63b79a4dddc75f17e))
* token-based access control ([55f649b](https://github.com/BlackGlory/chan/commit/55f649b61cbbba63610cda6ca1d3b75501c51cdb))
* use @dao/sqlite3 ([d89eaca](https://github.com/BlackGlory/chan/commit/d89eacad9f9acf6235793880741a888f851908a3))
* use right env ([a36259b](https://github.com/BlackGlory/chan/commit/a36259bf8a876bdf1fb5ee21b18996a73ebdbf6c))


* database ([358b563](https://github.com/BlackGlory/chan/commit/358b563d30a7b42b630ef46d16de7834e93a968a))
* rename ([6de5863](https://github.com/BlackGlory/chan/commit/6de5863146f3372bd3fadb4eb4ec657d71d8665f))
* rename ([cb2509c](https://github.com/BlackGlory/chan/commit/cb2509ca3c0d9de1685e694b16133fd15b4b2b2a))
* rename ([50bb4fa](https://github.com/BlackGlory/chan/commit/50bb4fac002a572a3ba27b18c04e74c96a18f00d))
* rename permissions ([88939eb](https://github.com/BlackGlory/chan/commit/88939ebe7d42e75094d8aacd26f4b4b4cdf410fd))
* rename project name ([a09f1ef](https://github.com/BlackGlory/chan/commit/a09f1efd30be5c7b5a282abedea8571bfc5e7f53))
