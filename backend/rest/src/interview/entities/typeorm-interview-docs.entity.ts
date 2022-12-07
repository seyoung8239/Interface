import { IsNumber, IsString } from 'class-validator';
import { TypeormBaseEntity } from 'src/common/typeorm-base.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Feedback } from './feedback.entity';
import { InterviewDocs } from './interview-docs.entity';
import { TypeormFeedbackEntity } from './typeorm-feedback.entity';

@Entity('interview_docs')
export class TypeormInterviewDocsEntity
	extends TypeormBaseEntity
	implements InterviewDocs<Feedback>
{
	@PrimaryColumn({ length: 36 })
	@IsString()
	id: string;

	@Column({ length: 45 })
	@IsString()
	userId: string;

	@Column({ length: 100 })
	@IsString()
	videoUrl: string;

	@Column()
	@IsNumber()
	videoPlayTime: number;

	@OneToMany(() => TypeormFeedbackEntity, (feedback) => feedback.docs, {
		cascade: true,
	})
	feedbackList: TypeormFeedbackEntity[];
}
