import * as express from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
const errorSend = (response: express.Response, message: string, specific: any): void => {
    response.status(400).json({
        error: {
            message: message,
            specific: specific,
        }
    });
};

export {
  errorSend
};
