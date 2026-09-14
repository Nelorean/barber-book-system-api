import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  it('should reject null name', async () => {
    const dto = Object.assign(new UpdateUserDto(), {
      name: null,
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'name')).toBe(true);
  });
  it('should allow missing name', async () => {
    const dto = new UpdateUserDto();

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});
