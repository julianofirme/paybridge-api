import axios from 'axios';
import { logger } from '../../logger/logger.js';
import { UnauthorizedError } from '../../errors/unauthorized-error.js';

export async function checkAuthorization(): Promise<boolean> {
  try {
    const response = await axios.get('https://util.devi.tools/api/v2/authorize', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.status === 'success' && response.data.data.authorization === true) {
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Error checking authorization:', error);
    throw new UnauthorizedError('Authorization check failed');
  }
}
