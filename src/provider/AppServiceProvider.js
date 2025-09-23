/* migrated from app/Providers/AppServiceProvider.php */

/**
 * Represents a service provider for registering and booting application services.
 * Mimics the core functionality of Laravel's AppServiceProvider in a Node.js ESM context.
 *
 * In Laravel, Service Providers are central to bootstrapping the application, registering
 * service container bindings, and booting services that need to run once the application is ready.
 *
 * This Node.js equivalent aims to provide similar lifecycle methods (`register` and `boot`)
 * to manage application setup within a dependency injection (DI) container or application instance.
 */
export class AppServiceProvider {
  /**
   * Register any application services.
   * This method is where you would typically bind services into the application's service container,
   * register singletons, or configure initial settings.
   *
   * @param {object} app - The application's service container or DI instance.
   * @param {object} deps - An object containing additional dependencies like config, logger, etc.
   */
  static register(app, deps = {}) {
    // TODO: Implement service bindings, singletons, and initial configuration.
    // Example: Registering a repository as a singleton in a DI container 'app'
    // if (app && typeof app.singleton === 'function') {
    //   app.singleton('UserRepository', () => new UserRepository(deps.dbConnection));
    // }
    // Example: Binding a service
    // if (app && typeof app.bind === 'function') {
    //   app.bind('PaymentService', () => new PaymentService(app.make('UserRepository')));
    // }
    // Example: Initial configuration setup
    // if (deps.config && typeof deps.config.set === 'function') {
    //   deps.config.set('app.name', 'My Node.js Application');
    // }
    console.log('AppServiceProvider: register method executed.');
  }

  /**
   * Bootstrap any application services.
   * This method is called after all service providers have been registered. It's suitable for tasks
   * that depend on all other services being bound, such as registering global event listeners,
   * defining custom casts, or extending core functionalities (macros).
   *
   * @param {object} app - The application's service container or DI instance.
   * @param {object} deps - An object containing additional dependencies like eventBus, config, logger, etc.
   */
  static boot(app, deps = {}) {
    // TODO: Implement global hooks, observers, macros, policies, and other post-registration tasks.
    // Example: Subscribing to an event via an event bus
    // if (deps.eventBus && typeof deps.eventBus.on === 'function') {
    //   deps.eventBus.on('UserRegistered', (user) => {
    //     console.log(`User ${user.id} was registered. Sending welcome email...`);
    //     // Call a service, e.g., app.make('MailService').sendWelcomeEmail(user);
    //   });
    // }
    // Example: Defining custom casts for an ORM (if applicable)
    // if (deps.orm && typeof deps.orm.defineCast === 'function') {
    //   deps.orm.defineCast('json', (value) => JSON.parse(value));
    // }
    // Example: Registering a global macro
    // if (deps.stringHelper && typeof deps.stringHelper.macro === 'function') {
    //   deps.stringHelper.macro('truncate', (str, length) => str.length > length ? str.substring(0, length) + '...' : str);
    // }
    console.log('AppServiceProvider: boot method executed.');
  }
}
