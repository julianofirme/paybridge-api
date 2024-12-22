import axios from 'axios';
import { BadRequestError } from '../../errors/bad-request-error.js';
import { logger } from '../../logger/logger.js';

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
    throw new BadRequestError('Authorization check failed');
  }
}
