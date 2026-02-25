import { processDuePosts, retryFailedPosts } from '../services/publishingService.js';

let jobInterval = null;
let isRunning = false;

/**
 * Start the publishing job
 * Runs every minute to check for due posts
 */
export function startPublishingJob() {
  if (jobInterval) {
    console.log('[Job] Publishing job already running');
    return;
  }

  console.log('[Job] Starting publishing job (runs every 1 minute)');

  // Run immediately on start
  runPublishingCycle();

  // Then run every minute
  jobInterval = setInterval(async () => {
    await runPublishingCycle();
  }, 60 * 1000); // 1 minute

  return jobInterval;
}

/**
 * Stop the publishing job
 */
export function stopPublishingJob() {
  if (jobInterval) {
    clearInterval(jobInterval);
    jobInterval = null;
    console.log('[Job] Publishing job stopped');
  }
}

/**
 * Run a single publishing cycle
 */
async function runPublishingCycle() {
  // Prevent overlapping runs
  if (isRunning) {
    console.log('[Job] Previous cycle still running, skipping...');
    return;
  }

  isRunning = true;

  try {
    const timestamp = new Date().toISOString();
    console.log(`[Job] Starting publishing cycle at ${timestamp}`);

    // Process due posts
    const result = await processDuePosts();
    
    if (result.processed > 0) {
      console.log(`[Job] ✅ Processed ${result.processed} posts`);
    }

    // Every 5 minutes, retry failed posts
    const minute = new Date().getMinutes();
    if (minute % 5 === 0) {
      console.log('[Job] Running retry cycle for failed posts');
      const retryResult = await retryFailedPosts();
      if (retryResult.retried > 0) {
        console.log(`[Job] ♻️  Retried ${retryResult.retried} failed posts`);
      }
    }
  } catch (error) {
    console.error('[Job] Error in publishing cycle:', error);
  } finally {
    isRunning = false;
  }
}

/**
 * Get job status
 */
export function getJobStatus() {
  return {
    isRunning: !!jobInterval,
    currentlyProcessing: isRunning
  };
}
