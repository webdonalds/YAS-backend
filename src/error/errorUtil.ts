import * as express from 'express';

const errorSend = (response: express.Response, message: string, specific: any) => {
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