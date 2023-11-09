import { UpdateResult } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { JwtUtils } from '../library/jwtUtils';
import { User } from '../entity/Users';

/**
 * Deals with User database queries
 */
export class UserRepository {
  /**
   * addPasswordRecoveryToken
   *
   * Adds passwordRecoveryToken to user instance for 30 minutes.
   *
   * @param user instance of a User.
   * @param userId number representing the user's id.
   * @returns {Promise<string>} Updates the user's token only, without interferring
   * with the other attributes of the user.
   */
  public static async addPasswordRecoveryToken(user: User, userId: number): Promise<string> {
    const token = await JwtUtils.generateJWTToken({ userId: userId }, '24h');

    user.passwordRecoveryToken = token;
    await MysqlDataSource.getRepository(User).update(user.id, {
      passwordRecoveryToken: token
    });

    return token;
  }

  /**
   *Finds a user in the database through a given email
   * @param email used as reference to find the user.
   * @returns {Promise<User | undefinded>} Returns user or not
   */
  public static async findUserByEmail(email: string): Promise<User | undefined> {
    return MysqlDataSource.getRepository(User).findOneBy({ email });
  }

  /**
   *Finds a user in the database through a given id
   * @param id used as reference to find the user.
   * @returns {Promise<User | undefinded>} Returns user or not
   */
  public static async findUserById(id: number): Promise<User | undefined> {
    return MysqlDataSource.getRepository(User).findOneBy({ id });
  }

  /**
   *Finds a user in the database through a given email
   * @param email used as reference to find the user.
   * @returns {Promise<User | undefinded>} Returns user or not, in case email is not found.
   */
  public static async saveAccessTokenInUser(userId: number, token: string): Promise<UpdateResult> {
    return MysqlDataSource.getRepository(User).update(userId, {
      accessToken: token
    });
  }
}
