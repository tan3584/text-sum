import { HttpStatus, Injectable } from '@nestjs/common';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { customThrowError } from 'src/common/helpers/throw.helper';
import { GetRequest } from 'src/dto/GetRequest.dto';
import { CreateTopicDto } from 'src/dto/post/createTopic.dto';
import { TopicResponse } from 'src/dto/post/topicResponse.dto';
import { UpdateTopicDto } from 'src/dto/post/updateTopic.dto';
import { Topic } from 'src/entities/topic/topic.enum';
import { Raw, FindManyOptions, Repository } from 'typeorm';
import { TopicRepository } from './topic.repository';
import { Comment } from 'src/entities/comment/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateComment } from 'src/dto/comment/createComment.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userRepository: UserRepository,
  ) {}

  async createTopic(
    model: CreateTopicDto,
    user: Record<string, any>,
  ): Promise<boolean> {
    if (!user.id) {
      customThrowError(RESPONSE_MESSAGES.INVALID, HttpStatus.FORBIDDEN);
    }
    const topic = new Topic();
    topic.createdBy = user.id;
    topic.subject = model.subject;
    topic.description = model.description;
    await this.topicRepository.save(topic);
    return true;
  }

  async editTopic(
    model: UpdateTopicDto,
    user: Record<string, any>,
  ): Promise<boolean> {
    const topic = await this.topicRepository.findOne(model.topicId);
    if (!topic) {
      customThrowError(RESPONSE_MESSAGES.TOPIC_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (topic.createdBy !== user.id) {
      customThrowError(RESPONSE_MESSAGES.INVALID, HttpStatus.UNAUTHORIZED);
    }
    topic.subject = model.subject;
    topic.description = model.description;
    await this.topicRepository.save(topic);
    return true;
  }

  async deleteTopic(
    topicId: number,
    user: Record<string, any>,
  ): Promise<boolean> {
    const topic = await this.topicRepository.findOne(topicId);
    if (!topic) {
      customThrowError(RESPONSE_MESSAGES.TOPIC_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (topic.createdBy !== user.id) {
      customThrowError(RESPONSE_MESSAGES.INVALID, HttpStatus.UNAUTHORIZED);
    }
    topic.createdBy = null;
    await this.topicRepository.delete(topicId);
    return true;
  }

  async getTopicById(topicId: number): Promise<TopicResponse> {
    const topic = await this.topicRepository.findOne(topicId);
    if (!topic) {
      customThrowError(RESPONSE_MESSAGES.TOPIC_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return new TopicResponse(topic);
  }

  async getTopicByUserId(
    model: GetRequest,
    user: Record<string, any>,
  ): Promise<[Topic[], number]> {
    const { search, skip, take } = model;
    const order = {};
    if (model.orderBy) {
      order[model.orderBy] = model.orderDirection;
    } else {
      (order as any).id = 'DESC';
    }
    let where = [];

    const rawWhere = Raw(
      alias => `LOWER(${alias}) like '%${search.toLowerCase()}%'`,
    );

    if (search) {
      where = [{ subject: rawWhere }, { description: rawWhere }];
    }
    let whereModified;
    if (where.length) {
      whereModified = where.map(condition => {
        const o = Object.assign({}, condition);
        o.createdBy = user.id;
        return o;
      });
    } else {
      whereModified = { createdBy: user.id };
    }

    const options: FindManyOptions<Topic> = {
      select: ['id', 'createdDate', 'updatedDate', 'subject', 'description'],
      where: whereModified,
      skip,
      take,
      order,
    };
    const [topics, count] = await this.topicRepository.findAndCount(options);
    if (!topics) {
      return [[], 0];
    }

    return [topics, count];
  }

  async getNewTopics(model: GetRequest): Promise<[Topic[], number]> {
    const { search, skip, take } = model;
    const order = {};
    if (model.orderBy) {
      order[model.orderBy] = model.orderDirection;
    } else {
      (order as any).id = 'DESC';
    }
    let where = [];

    const rawWhere = Raw(
      alias => `LOWER(${alias}) like '%${search.toLowerCase()}%'`,
    );

    if (search) {
      where = [{ subject: rawWhere }, { description: rawWhere }];
    }

    const options: FindManyOptions<Topic> = {
      select: ['id', 'createdDate', 'updatedDate', 'subject', 'description'],
      where,
      skip,
      take,
      order,
      relations: ['user'],
    };
    const [topics, count] = await this.topicRepository.findAndCount(options);
    if (!topics) {
      return [[], 0];
    }

    return [topics, count];
  }

  async getTopicComments(model: GetRequest): Promise<[Comment[], number]> {
    const { search, skip, take } = model;
    const order = {};
    if (model.orderBy) {
      order[model.orderBy] = model.orderDirection;
    } else {
      (order as any).id = 'DESC';
    }
    let where = [];

    const rawWhere = Raw(
      alias => `LOWER(${alias}) like '%${search.toLowerCase()}%'`,
    );

    if (search) {
      where = [{ subject: rawWhere }, { description: rawWhere }];
    }

    const options: FindManyOptions<Comment> = {
      select: ['id', 'createdDate', 'updatedDate', 'content'],
      where,
      skip,
      take,
      order,
      relations: ['user'],
    };
    const [comments, count] = await this.commentRepository.findAndCount(
      options,
    );
    if (!comments) {
      return [[], 0];
    }

    return [comments, count];
  }

  async getCommentsHistory(
    model: GetRequest,
    user: Record<string, any>,
  ): Promise<[Comment[], number]> {
    const { search, skip, take } = model;
    const order = {};
    if (model.orderBy) {
      order[model.orderBy] = model.orderDirection;
    } else {
      (order as any).id = 'DESC';
    }
    let where = [];

    const rawWhere = Raw(
      alias => `LOWER(${alias}) like '%${search.toLowerCase()}%'`,
    );

    if (search) {
      where = [{ subject: rawWhere }, { description: rawWhere }];
    }
    let whereModified;
    if (where.length) {
      whereModified = where.map(condition => {
        const o = Object.assign({}, condition);
        o.createdBy = user.id;
        return o;
      });
    } else {
      whereModified = { createdBy: user.id };
    }

    const options: FindManyOptions<Comment> = {
      select: ['id', 'createdDate', 'updatedDate', 'content'],
      where: whereModified,
      skip,
      take,
      order,
      relations: ['user'],
    };
    const [comments, count] = await this.commentRepository.findAndCount(
      options,
    );
    if (!comments) {
      return [[], 0];
    }

    return [comments, count];
  }

  async replyToTopic(
    model: CreateComment,
    topicId: number,
    user: Record<string, any>,
  ): Promise<boolean> {
    const topic = await this.topicRepository.findOne(topicId);
    if (!topic) {
      customThrowError(RESPONSE_MESSAGES.TOPIC_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const comment = new Comment();
    comment.content = model.content;
    comment.createdBy = user.id;
    await this.commentRepository.save(comment);
    return true;
  }

  async editComment(
    model: CreateComment,
    commentId: number,
    user: Record<string, any>,
  ): Promise<boolean> {
    const comment = await this.commentRepository.findOne(commentId, {
      relations: ['user'],
    });
    if (!comment) {
      customThrowError(
        RESPONSE_MESSAGES.COMMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (comment.user.id !== user.id) {
      customThrowError(RESPONSE_MESSAGES.INVALID, HttpStatus.UNAUTHORIZED);
    }
    comment.content = model.content;
    await this.commentRepository.save(comment);
    return true;
  }

  async likeTopic(
    topicId: number,
    user: Record<string, any>,
  ): Promise<boolean> {
    const topic = await this.topicRepository.findOne(topicId);
    const userLike = await this.userRepository.findOne(user.id, {
      select: ['id'],
    });
    if (!userLike) {
      customThrowError(RESPONSE_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    topic.likeCount = topic.likeCount + 1;
    topic.usersLiked.push(userLike);
    await this.topicRepository.save(topic);
    return true;
  }

  async removeLikedUser(topicId: number, userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne(userId);
    const topic = await this.topicRepository.findOne(topicId, {
      select: ['id', 'likeCount'],
      relations: ['usersLiked'],
    });
    if (!topic) {
      customThrowError(RESPONSE_MESSAGES.TOPIC_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const remainingUser = [];
    topic.usersLiked.forEach(likedUser => {
      if (likedUser.id !== user.id) {
        remainingUser.push(likedUser);
      }
    });
    topic.usersLiked = remainingUser;
    topic.likeCount = topic.likeCount - 1;
    await this.topicRepository.save(topic);
    return true;
  }
}
