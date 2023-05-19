import { JoiValidationPipe } from './joi-validation.pipe';
import Joi from 'joi';

describe('JoiValidationPipe', () => {
  it('should be defined', () => {
    expect(new JoiValidationPipe(Joi.object())).toBeDefined();
  });
});
