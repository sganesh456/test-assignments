# Assignment

A test project using the automation tool, [Cypress](https://www.cypress.io/). This includes BDD style tests for 
- Opening an Account (SAVINGS/CHECKING)
- Verification of Account details page
- Verification of Bill pay functionality
- Verification of Account services section
- Verification of Balance and transaction table details
- Verification of Login, Create Account, Account Overview, Bill Pay and Transaction API's
- Verification of different error codes from above api's
- Visual tests for Account overview page before and after a billpay

## Requires
1. [node](https://nodejs.org/en/) - Latest version
1. [git](https://git-scm.com/)

## Setup
1. clone: `https://github.com/sganesh456/test-assignments.git`
1. install: `npm i`
1. set-percy-token: 
In the shell window you're working in, export the token environment variable:

**Windows**

``` shell
$ set PERCY_TOKEN="<token>"

# PowerShell
$ $Env:PERCY_TOKEN="<token>"
```

## Run Tests
1. All tests: `npm test`
1. Headless: `npm run headless`
1. Visual tests - Percy: `npm run percy`

## Watch video
Once tests were executed, video files will be created matching spec filenames under videos folder.
