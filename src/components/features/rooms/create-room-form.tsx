import { CreateRoom } from '@/services/room';
import type { Room, RoomFormData } from '@/types';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

const CreateRoomForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormData>();

  const onSubmit = async (data: RoomFormData) => {
    try {
      await CreateRoom({ name: data.name } as Room);
      navigate(`/`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="text"
          placeholder="Enter room name"
          {...register('name', { required: 'Please enter a room name' })}
        />
        {errors.name && <p className="error-text">{errors.name.message}</p>}
      </div>
      <button type="submit">Create Room</button>
    </form>
  );
};

export default CreateRoomForm;
