class VueRouteMiddleware {
  /**
   * Set instance properties and call defined
   * middlewares on matching routes
   *
   * @param {object} definedMiddlewares
   * @param {object} to
   * @param {object} from
   * @param {function|undefined} next
   *
   * @var {object} middlewares // predefined middlewares
   * @var {boolean} nextHasCalled // if next was called in the middlewares
   * @var {array} toMiddleware // arguments passed to middleware function
   */
  constructor(definedMiddlewares, to, from, next) {
    if (this._isObject(definedMiddlewares)) {
      this.middlewares = definedMiddlewares;
    } else {
      this._error("Defined middlewares must be of type Object!");
      this.middlewares = {};
    }
    this.to = to;
    this.from = from;
    this.next = next;
    this.nextHasCalled = false;
    if (this.to && this.to.matched) {
      // Apply middleware if anu route matched
      to.matched.every((route) => this.applyRouteMiddlewares(route));
    }
    if (this.next && !this.nextHasCalled) {
      // call next if user didnt call it
      this.callNext();
    }
  }

  /**
   * Function used to pass arguments to middlewares with spred syntax
   *
   * @return {array}
   */
  toMiddleware() {
    return [
      this.to,
      this.from,
      this._isFunction(this.next) ? this.callNext.bind(this) : undefined,
    ];
  }

  /**
   * Function that is passed to middleware as a next function wrapper
   * toggling `nextHasCalled` trigger
   *
   * @param  {...any} args
   */
  callNext(...args) {
    if (!this.nextHasCalled) this.nextHasCalled = true;
    return this.next(...args);
  }

  /**
   * Fuction applying middlewares of a single route and deciding
   * if other matched routes should be checked as well
   *
   * @param {*} route
   *
   * @return {boolean}
   */
  applyRouteMiddlewares(route) {
    if (route.meta && route.meta.middleware) {
      let middlewareKeys = route.meta.middleware;
      if (this._isArray(middlewareKeys)) {
        return middlewareKeys.every((middleware) =>
          this.applyMiddleware(middleware)
        );
      } else {
        return this.applyMiddleware(middlewareKeys);
      }
    }
    return true;
  }

  /**
   * Function calling middlewares and deciding if middleware chain
   * must be continued or stopped after first faliure
   *
   * @param {string|function} middleware
   *
   * @return {boolean}
   */
  applyMiddleware(middleware) {
    const result = this.getMiddleware(middleware)(...this.toMiddleware());
    return result === undefined ? true : result;
  }

  /**
   * Function to get middleware function.
   * In case of function validation failure
   * console the error and return empty function
   *
   * @param {string|function} middleware
   *
   * @return {function}
   */
  getMiddleware(middleware) {
    if (this._isString(middleware)) {
      if (Object.prototype.hasOwnProperty.call(this.middlewares, middleware)) {
        if (this._isFunction(this.middlewares[middleware])) {
          return this.middlewares[middleware];
        } else {
          this._error(middleware + " is not a function!");
        }
      }
    } else if (this._isFunction(middleware)) {
      return middleware;
    } else {
      this._error("All middlewares must be functions!");
    }
    return () => true;
  }

  /**
   * @param {string} text
   *
   * @return {boolean}
   */
  _error(text) {
    console.error(this.constructor.name + ": " + text);
  }

  /**
   * @param {*} toCheck
   *
   * @return {boolean}
   */
  _isString(toCheck) {
    return typeof toCheck === "string" || toCheck instanceof String;
  }

  /**
   * @param {*} toCheck
   *
   * @return {boolean}
   */
  _isArray(toCheck) {
    return Array.isArray(toCheck);
  }

  /**
   * @param {*} toCheck
   *
   * @return {boolean}
   */
  _isFunction(toCheck) {
    return typeof toCheck === "function";
  }

  /**
   * @param {*} toCheck
   *
   * @return {boolean}
   */
  _isObject(toCheck) {
    return typeof toCheck === "object" && toCheck !== null;
  }
}

export default (definedGroups = {}) => {
  return (...toMiddleware) =>
    new VueRouteMiddleware(definedGroups, ...toMiddleware);
};
