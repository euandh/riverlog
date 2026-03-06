import PocketBase from 'pocketbase';

// Declare the connection
const pb = new PocketBase('http://127.0.0.1:8090');

// Disable auto-cancellation so Next.js server components don't accidentally cancel each other's requests
pb.autoCancellation(false);

// Export it so the rest of your app can use it
export default pb;