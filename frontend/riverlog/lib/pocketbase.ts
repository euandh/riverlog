import PocketBase from 'pocketbase';

// Next.js will look for the live URL first. If it can't find it, it defaults to localhost!
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090');

pb.autoCancellation(false);

export default pb;