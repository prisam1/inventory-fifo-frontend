import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


type LoginFormInputs = {
  username: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    const success = await login(data);
    if (success) {
      navigate('/dashboard');
      toast.success("Login successfully!");
    } else {
      setError('username', { type: 'manual', message: 'Invalid username or password' });
      setError('password', { type: 'manual', message: 'Invalid username or password' });
      toast.success("Login Failed!");
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <Controller
            name="username"
            control={control}
            rules={{
              required: 'Username is required'
            }}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  id="username"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required',
            }}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  id="password"
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </>
            )}
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
