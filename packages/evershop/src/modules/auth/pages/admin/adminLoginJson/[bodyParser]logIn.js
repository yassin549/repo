import { translate } from '../../../../../lib/locale/translate/translate.js';
import {
  INTERNAL_SERVER_ERROR,
  INVALID_PAYLOAD,
  OK
} from '../../../../../lib/util/httpStatus.js';

export default async (request, response, delegate, next) => {
  try {
    const message = translate('Invalid email or password');
    const { body } = request;
    const { email, password } = body;
    await request.loginUserWithEmail(email, password);
    response.status(OK);
    response.$body = {
      data: {
        sid: request.sessionID
      }
    };
    next();
  } catch (error) {
    response.status(INVALID_PAYLOAD).json({
      error: {
        message: error.message,
        status: INVALID_PAYLOAD
      }
    });
  }
};
