import CreateRoomForm from '@/components/features/rooms/create-room-form';

const CreateRoomPage = () => {
  return (
    <div className="create-room-container">
      <div className="create-room">
        <h2>Create a new room</h2>
        <CreateRoomForm />
      </div>
    </div>
  );
};

export default CreateRoomPage;
