import { JwtModuleOptions } from '@nestjs/jwt';

export default (): JwtModuleOptions => {
  return {
    secret: process.env.JWT_SECRET,
    signOptions: { 
      expiresIn: process.env.JWT_EXPIRES 
    },
  };
};
