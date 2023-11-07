import { Request, Response } from 'express';

export default class CharactersController {
  /**
   * @swagger
   * /v1/getCharacters/:page:
   *   get:
   *     summary: Retorna dados de personagens a partir de determinada página
   *     tags: [getCharacters/page]
   *     parameters:
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: número da página de interesse para visualização dos personagens
   *         example: 2
   *     responses:
   *       '200':
   *         description: Requisição executada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 date:
   *                   type: string
   *                   description: Data de envio da resposta à requisição
   *                   format: date
   *                 status:
   *                   type: boolean
   *                   description: Status de execução da requisição
   *                 translated:
   *                   type: boolean
   *                   description: Indicação de tradução dos dados
   *                 data:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                       description: Nome do personagem
   *                     description:
   *                       type: string
   *                       description: Descrição do personagem
   *                     thumbnail:
   *                       type: string
   *                       description: thumbnail URL do personagem em formato string
   *               example:
   *                     date: "2023-10-28T19:32:46.116Z"
   *                     status: true
   *                     translated: true
   *                     data:
   *                       name: Vingadores
   *                       description: Os heróis mais poderosos da Terra uniram forças para enfrentar ameaças que eram grandes demais para serem enfrentadas por qualquer herói. Com uma lista que inclui Capitão América, Homem de Ferro, Homem-Formiga, Hulk, Thor, Vespa e dezenas de outros ao longo dos anos, os Vingadores passaram a ser considerados o time número 1 da Terra.
   *                       thumbnail: "http://i.annihil.us/u/prod/marvel/i/mg/9/20/5102c774ebae7.jpg"
   
   *       '500':
   *         description: Erro interno do servidor. Não foi possível exibir os dados
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 date:
   *                   type: string
   *                   description: Data de envio da resposta à requisição
   *                   format: date
   *                 status:
   *                   type: boolean
   *                   description: Status de execução da requisição
   *                 data:
   *                   type: string
   *                   description: Mensagem de erro
   *               example:
   *                 date: 2023-10-28T19:59:19.751Z
   *                 status: false
   *                 data: Erro interno do servidor
   */
  viewCharacters(error, req: Request, res: Response) {
    if (error) {
      console.error('Erro ao traduzir os dados: ', error);
      const untranslatedCharacters = res.locals.untranslatedCharacters;

      // Se houver erro na tradução, retorna o personagem original não traduzido
      res.status(200).json({
        date: new Date(),
        status: true,
        translated: false,
        data: untranslatedCharacters
      });
    } else {
      const translatedCharacters = res.locals.translatedCharacters;
      res.status(200).json({
        date: new Date(),
        status: true,
        translated: true,
        data: translatedCharacters
      });
    }
  }
}