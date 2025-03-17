import React, { useState } from "react";

import {
  Form,
  Input,
  Button,
  Select,
  List,
  Checkbox,
  Card,
  Typography,
  Spin,
  Alert,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import "../styles/dashboard.css";

const queryClient = new QueryClient();

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface Task {
  _id: string;
  name: string;
  description: string;
  priority: string;
  completionStatus: boolean;
}

const Dashboard: React.FC = () => {
  const [form] = Form.useForm();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:5000/tasks/all-tasks",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    },
  });

  const handleSubmit = async (values: Omit<Task, "id" | "completed">) => {
    if (editingTaskId) {
      await axios.put(
        `http://localhost:5000/tasks/update-task/${editingTaskId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingTaskId(null);
    } else {
      await axios.post(
        "http://localhost:5000/tasks/create-task",
        { ...values, completed: false },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }
    refetch();
    form.resetFields();
  };

  const deleteTask = async (id: string) => {
    await axios.delete(`http://localhost:5000/tasks/del-task/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    refetch();
  };

  const toggleComplete = async (taskId: string) => {
    const task = tasks.find((task) => task._id === taskId);
    if (task) {
      const values: Omit<Task, "id" | "completed"> = { ...task };
      await axios.put(
        `http://localhost:5000/tasks/update-task/${taskId}`,
        { ...values, completionStatus: !task.completionStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }
    refetch();
  };

  const editTask = (task: Task) => {
    form.setFieldsValue({
      name: task.name,
      description: task.description,
      priority: task.priority,
    });

    setEditingTaskId(task._id);
    refetch();
  };

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Spin size="large" className="loading-spinner" />;
  if (isError) return <Alert message="Error loading tasks" type="error" />;

  return (
    <div className="dashboard-container">
      <Card className="dashboard-card">
        <Title level={2} className="dashboard-title">
          Task Dashboard
        </Title>

        <Input.Search
          placeholder="Search tasks..."
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <Form
          form={form}
          layout="inline"
          onFinish={handleSubmit}
          className="task-form"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter task name" }]}
          >
            <Input placeholder="Task Name" />
          </Form.Item>

          <Form.Item name="description">
            <TextArea placeholder="Description" autoSize />
          </Form.Item>

          <Form.Item name="priority" initialValue="Medium">
            <Select style={{ width: 120 }}>
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTaskId ? "Update Task" : "Add Task"}
            </Button>
          </Form.Item>
        </Form>

        <List
          className="task-list"
          dataSource={filteredTasks}
          renderItem={(task) => (
            <List.Item
              className={`task-item ${
                task.completionStatus ? "completed" : ""
              }`}
            >
              <div className="task-content">
                <Checkbox
                  checked={task.completionStatus}
                  onChange={() => toggleComplete(task._id)}
                />
                <div className="task-info">
                  <h3>{task.name}</h3>
                  <p>{task.description}</p>
                  <span
                    className={`priority-tag priority-${task.priority.toLowerCase()}`}
                  >
                    {task.priority} Priority
                  </span>
                </div>
              </div>
              <div className="task-actions">
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => editTask(task)}
                />
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deleteTask(task._id)}
                />
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <Dashboard />
  </QueryClientProvider>
);

export default App;
