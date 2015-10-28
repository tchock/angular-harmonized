/**
 * @ngdoc module
 * @name angular-harmonized
 * @module angular-harmonized
 * @description
 *
 * # angular-harmonized
 * Test Test!
 */

'use strict';

/**
 * @ngdoc service
 * @name Harmonized
 * @module angular-harmonized
 * @required $http
 * @required $q
 *
 * @description
 * A factory which creates a HarmonizedResource object that lets you save data
 * locally with local database support (IndexedDB and WebSQL) and also synchronize
 * the local data with the server using the $resource
 * [RESTful](http://en.wikipedia.org/wiki/Representational_State_Transfer)
 * implementation.
 *
 * Unlike the $resource service the HarmonizedResource uses the localDb service to
 * save the data for the $scope
 * itself, so it doesn't have to be synchronized with the $resource return manually.
 * For synchonisation purposes it also stores intern-use-only values like ``_id``
 * as a unique key for the databases, ``deleted`` as a boolean flag for deleted
 * entries (these entries won't be visible for the $scope unless you want it to
 * be [but on that later]) or ``_synchronized`` as a boolean flag for the
 * synchronization status with the server. These intern-use-only values can be
 * identified through the leading underscore (``_``). By default these
 * intern-use-only values don't show up in the data visible to the $scope, but
 * can be made visible via the HarmonizedProvider.
 *
 * The returned HarmonizedResource has action methods like the $resource
 * service (save, query, delete, ...).
 */
angular.module('angular-harmonized', []).provider('harmonized', function() {

  //jscs:disable
  var provider = this;
  //jscs:enable

  // true if called for the first time
  var initiated = false;

  // public API for configuration
  this.setConfig = function setConfig(config) {
    harmonized.setConfig(config);
  };

  this.setModelSchema = function setModelSchema(schema) {
    harmonized.setModelSchema(schema);
  };

  // method for instantiating
  this.$get = function $get($rootScope, $http, $q, $timeout) {

    var service = {
      setConfig: provider.setConfig,

      getErrorStream: function getErrorStream() {
        return harmonized.errorStream;
      },

      build: function(httpOptionsTransform) {

        // http function
        var httpFn = function(httpOptions) {
          var deferred = $q.defer();

          // Transform the http options
          if (_.isFunction(httpOptionsTransform)) {
            httpOptions = httpOptionsTransform(httpOptions);
          }

          $http(httpOptions).success(function(data, status, header) {
            deferred.resolve({
              data: data,
              status: status,
              header: header,
            });
          }).error(function(data, status, header) {
            var error = new Error('HTTP error');
            error.target = {
              data: data,
              status: status,
              header: header,
            };
            deferred.reject(error);
          });

          return deferred.promise;
        };

        // view update function
        var viewUpdateFn = function(callback) {
          $rootScope.$evalAsync(callback);
        };

        harmonized.setup(httpFn, viewUpdateFn);
        harmonized.setPromiseClass($q);

        harmonized.build();
      },

      destroy: harmonized.destroy,
      pushAll: harmonized.pushAll,
      fetchAll: harmonized.getFromServer,
      setOnline: harmonized.setOnline,
      setOffline: harmonized.setOffline,
      createViewModel: harmonized.createViewModel,
    };

    return service;
  };
});
