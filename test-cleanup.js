const CleanupService = require('./src/utils/cleanup.js');

console.log('CleanupService:', CleanupService);
console.log('CleanupService type:', typeof CleanupService);
console.log('CleanupService methods:', Object.getOwnPropertyNames(CleanupService));
console.log('startAutomaticCleanup type:', typeof CleanupService.startAutomaticCleanup);

if (typeof CleanupService.startAutomaticCleanup === 'function') {
    console.log('Function is available!');
} else {
    console.log('Function is NOT available!');
}
