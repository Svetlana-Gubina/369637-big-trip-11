export default class CustomValidation {
  constructor(validityChecks) {
    this._invalidities = [];
    this._validityChecks = validityChecks;
  }

  addInvalidity(message) {
    this._invalidities.push(message);
  }

  getInvalidities() {
    return this._invalidities.join(`\n`);
  }

  checkValidity(parameter) {
    this._invalidities = [];

    for (let check of this._validityChecks) {
      const isInvalid = check.isInvalid(parameter);

      if (isInvalid) {
        this.addInvalidity(check.invalidityMessage);
      }
    }
  }
}
