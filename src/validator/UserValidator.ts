import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { Repository } from '../repository/UserRepository';
import { Gender } from '../library/genderTypes';

function genderTypes(): typeof Gender {
  return Gender;
}

export const validationField = [
  body('name')
    .notEmpty()
    .withMessage('Nome não pode ser vazio')
    .bail()
    .matches(/^[a-zA-Z\s]+$/),

  body('gender')
    .notEmpty()
    .withMessage('Gênero não pode ser vazio')
    .bail()
    .isIn(Object.values(genderTypes()))
    .withMessage('Selecione um gênero válido'),

  body('birthDate')
    .notEmpty()
    .withMessage('Data de nascimento não pode ser vazio')
    .bail()
    .isDate({
      format: 'YYYY-MM-DD',
      delimiters: ['-']
    })
    .withMessage('Formato incorreto de data')
    .bail()
    .isBefore(new Date().toLocaleDateString())
    .withMessage('Informe data válida'),

  body('email')
    .notEmpty()
    .withMessage('E-mail não pode ser vazio')
    .bail()
    .isEmail()
    .withMessage('Informe um e-mail válido')
    .custom(async (email: string) => {
      const repository = new Repository();
      const existingUser = await repository.findOneByEmail(email);
      if (existingUser) {
        return false;
      }
    })
    .withMessage('E-mail já cadastrado'), /// AJUSTAR PARA EXIBIR MENSAGEM NO REFINAMENTO

  body('password')
    .notEmpty()
    .withMessage('Informe uma senha')
    .bail()
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage(
      'Senha deve conter no mínimo 8 caracteres e ao menos 1 letra maiúscula, 1 número e 1 carcter especial'
    )
];

export function Validator(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ date: new Date(), status: false, data: errors.array() });
  }
  next();
}