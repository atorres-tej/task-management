
CREATE TABLE [dbo].[Tasks](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](200) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[DueDate] [datetime2](7) NULL,
	[StatusId] [int] NOT NULL,
	[AssignedTo] [int] NULL,
	[CreatedBy] [int] NOT NULL,
	[UpdatedBy] [int] NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK__Tasks__3214EC079E8D558D] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TaskStatus]    Script Date: 7/14/2025 2:54:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TaskStatus](
	[Id] [int] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 7/14/2025 2:54:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ExternalId] [nvarchar](100) NOT NULL,
	[DisplayName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](256) NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Tasks] ON 

INSERT [dbo].[Tasks] ([Id], [Title], [Description], [DueDate], [StatusId], [AssignedTo], [CreatedBy], [UpdatedBy], [CreatedAt], [UpdatedAt]) VALUES (1, N'Primera tarea', N'Descripción de la primera tarea', CAST(N'2025-07-15T00:00:00.0000000' AS DateTime2), 3, NULL, 1, 4, CAST(N'2025-07-12T16:55:48.9333333' AS DateTime2), CAST(N'2025-07-13T22:33:08.9255580' AS DateTime2))
INSERT [dbo].[Tasks] ([Id], [Title], [Description], [DueDate], [StatusId], [AssignedTo], [CreatedBy], [UpdatedBy], [CreatedAt], [UpdatedAt]) VALUES (2, N'Segunda tarea', N'Descripción de la segunda tarea', CAST(N'2025-07-20T00:00:00.0000000' AS DateTime2), 1, 2, 1, 4, CAST(N'2025-07-12T16:55:48.9333333' AS DateTime2), CAST(N'2025-07-13T22:33:40.3981608' AS DateTime2))
INSERT [dbo].[Tasks] ([Id], [Title], [Description], [DueDate], [StatusId], [AssignedTo], [CreatedBy], [UpdatedBy], [CreatedAt], [UpdatedAt]) VALUES (4, N'Tarea urgente', N'Tarea urgente!!', CAST(N'2025-07-19T00:00:00.0000000' AS DateTime2), 2, 2, 4, 4, CAST(N'2025-07-13T20:07:04.9680708' AS DateTime2), CAST(N'2025-07-13T20:07:35.2495647' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Tasks] OFF
GO
INSERT [dbo].[TaskStatus] ([Id], [Name]) VALUES (1, N'Pending')
INSERT [dbo].[TaskStatus] ([Id], [Name]) VALUES (2, N'In Progress')
INSERT [dbo].[TaskStatus] ([Id], [Name]) VALUES (3, N'Done')
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([Id], [ExternalId], [DisplayName], [Email], [CreatedAt]) VALUES (1, N'extid1', N'Juan Pérez', N'juan.perez@example.com', CAST(N'2025-07-12T16:55:00.1066667' AS DateTime2))
INSERT [dbo].[Users] ([Id], [ExternalId], [DisplayName], [Email], [CreatedAt]) VALUES (2, N'extid2', N'Ana Gómez', N'ana.gomez@example.com', CAST(N'2025-07-12T16:55:00.1066667' AS DateTime2))
INSERT [dbo].[Users] ([Id], [ExternalId], [DisplayName], [Email], [CreatedAt]) VALUES (4, N'a98503b3e37391df', N'Adolfo Torres', N'atorres.tej@outlook.com', CAST(N'2025-07-13T19:24:27.5412171' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
/****** Object:  Index [IX_Tasks_AssignedTo]    Script Date: 7/14/2025 2:54:54 AM ******/
CREATE NONCLUSTERED INDEX [IX_Tasks_AssignedTo] ON [dbo].[Tasks]
(
	[AssignedTo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Tasks_CreatedBy]    Script Date: 7/14/2025 2:54:54 AM ******/
CREATE NONCLUSTERED INDEX [IX_Tasks_CreatedBy] ON [dbo].[Tasks]
(
	[CreatedBy] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Tasks_DueDate]    Script Date: 7/14/2025 2:54:54 AM ******/
CREATE NONCLUSTERED INDEX [IX_Tasks_DueDate] ON [dbo].[Tasks]
(
	[DueDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Tasks_StatusId]    Script Date: 7/14/2025 2:54:54 AM ******/
CREATE NONCLUSTERED INDEX [IX_Tasks_StatusId] ON [dbo].[Tasks]
(
	[StatusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__A9D105346248112E]    Script Date: 7/14/2025 2:54:54 AM ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Users_Email]    Script Date: 7/14/2025 2:54:54 AM ******/
CREATE NONCLUSTERED INDEX [IX_Users_Email] ON [dbo].[Users]
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Users_ExternalId]    Script Date: 7/14/2025 2:54:54 AM ******/
CREATE NONCLUSTERED INDEX [IX_Users_ExternalId] ON [dbo].[Users]
(
	[ExternalId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Tasks] ADD  CONSTRAINT [DF__Tasks__CreatedAt__2D27B809]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Tasks] ADD  CONSTRAINT [DF__Tasks__UpdatedAt__2E1BDC42]  DEFAULT (getdate()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK__Tasks__AssignedT__2C3393D0] FOREIGN KEY([AssignedTo])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK__Tasks__AssignedT__2C3393D0]
GO
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK__Tasks__CreatedBy__2B3F6F97] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK__Tasks__CreatedBy__2B3F6F97]
GO
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK__Tasks__StatusId__2A4B4B5E] FOREIGN KEY([StatusId])
REFERENCES [dbo].[TaskStatus] ([Id])
GO
ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK__Tasks__StatusId__2A4B4B5E]
GO
/****** Object:  StoredProcedure [dbo].[CreateTask]    Script Date: 7/14/2025 2:54:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CreateTask]
    @Title NVARCHAR(200),
    @Description NVARCHAR(MAX),
    @DueDate DATETIME2,
    @StatusId INT,
    @CreatedBy INT,
    @AssignedTo INT = NULL
AS
BEGIN
    INSERT INTO Tasks (Title, Description, DueDate, StatusId, CreatedBy, AssignedTo, CreatedAt, UpdatedAt)
    VALUES (@Title, @Description, @DueDate, @StatusId, @CreatedBy, @AssignedTo, SYSDATETIME(), SYSDATETIME());

    SELECT SCOPE_IDENTITY() AS NewTaskId;
END
GO
/****** Object:  StoredProcedure [dbo].[CreateUser]    Script Date: 7/14/2025 2:54:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[CreateUser]
    @ExternalId NVARCHAR(100),
    @DisplayName NVARCHAR(200),
    @Email NVARCHAR(200)
AS
BEGIN
    INSERT INTO Users (ExternalId, DisplayName, Email, CreatedAt)
    VALUES (@ExternalId, @DisplayName, @Email, SYSDATETIME());

    SELECT SCOPE_IDENTITY() AS NewUserId;
END
GO
/****** Object:  StoredProcedure [dbo].[DeleteTask]    Script Date: 7/14/2025 2:54:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[DeleteTask]
    @Id INT
AS
BEGIN
    DELETE FROM Tasks
    WHERE Id = @Id;
END
GO
/****** Object:  StoredProcedure [dbo].[GetTaskById]    Script Date: 7/14/2025 2:54:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetTaskById]
    @Id INT
AS
BEGIN
    SELECT t.*, a.DisplayName AS AssignedToName, s.Name AS StatusName
    FROM Tasks t
    JOIN TaskStatus s ON t.StatusId = s.Id
    LEFT JOIN Users a ON t.AssignedTo = a.Id
    WHERE t.Id = @Id
END
GO
/****** Object:  StoredProcedure [dbo].[GetTasks]    Script Date: 7/14/2025 2:54:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetTasks]
    @StatusId INT = NULL,
    @AssignedTo INT = NULL,
    @OrderBy NVARCHAR(50) = 'DueDate',
    @OrderDir NVARCHAR(4) = 'ASC'
AS
BEGIN
    SELECT t.*, u.DisplayName AS AssignedToName, s.Name AS StatusName
    FROM Tasks t
    LEFT JOIN Users u ON t.AssignedTo = u.Id
    LEFT JOIN TaskStatus s ON t.StatusId = s.Id
    WHERE (@StatusId IS NULL OR t.StatusId = @StatusId)
      AND (@AssignedTo IS NULL OR t.AssignedTo = @AssignedTo)
    ORDER BY
        CASE WHEN @OrderBy = 'DueDate' AND @OrderDir = 'ASC' THEN t.DueDate END ASC,
        CASE WHEN @OrderBy = 'DueDate' AND @OrderDir = 'DESC' THEN t.DueDate END DESC,
        CASE WHEN @OrderBy = 'Title' AND @OrderDir = 'ASC' THEN t.Title END ASC,
        CASE WHEN @OrderBy = 'Title' AND @OrderDir = 'DESC' THEN t.Title END DESC,
        CASE WHEN @OrderBy = 'Status' AND @OrderDir = 'ASC' THEN s.Name END ASC,
        CASE WHEN @OrderBy = 'Status' AND @OrderDir = 'DESC' THEN s.Name END DESC
END
GO
/****** Object:  StoredProcedure [dbo].[GetTaskStatuses]    Script Date: 7/14/2025 2:54:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetTaskStatuses]
AS
BEGIN
    SELECT 
        Id,
        Name
    FROM [TaskStatus]
END

GO
/****** Object:  StoredProcedure [dbo].[GetUserByExternalId]    Script Date: 7/14/2025 2:54:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[GetUserByExternalId]
    @ExternalId NVARCHAR(100)
AS
BEGIN
    SELECT TOP 1 Id, ExternalId, DisplayName, Email, CreatedAt
    FROM Users
    WHERE ExternalId = @ExternalId;
END
GO
/****** Object:  StoredProcedure [dbo].[GetUsers]    Script Date: 7/14/2025 2:54:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetUsers]
AS
BEGIN
    SELECT 
        Id,
        ExternalId,
        DisplayName,
        Email,
        CreatedAt
    FROM [Users]
END

GO
/****** Object:  StoredProcedure [dbo].[UpdateTask]    Script Date: 7/14/2025 2:54:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UpdateTask]
    @Id INT,
    @Title NVARCHAR(200),
    @Description NVARCHAR(MAX),
    @DueDate DATETIME2,
    @StatusId INT,
	@UpdatedBy INT = NULL,
    @AssignedTo INT = NULL
AS
BEGIN
    UPDATE Tasks
    SET Title = @Title,
        Description = @Description,
        DueDate = @DueDate,
        StatusId = @StatusId,
        AssignedTo = @AssignedTo,
		UpdatedBy = @UpdatedBy,
        UpdatedAt = SYSDATETIME()
    WHERE Id = @Id;
END
GO
/****** Object:  StoredProcedure [dbo].[UpdateUser]    Script Date: 7/14/2025 2:54:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[UpdateUser]
    @Id INT,
    @ExternalId NVARCHAR(100),
    @DisplayName NVARCHAR(200),
    @Email NVARCHAR(200)
AS
BEGIN
    UPDATE Users
    SET ExternalId = @ExternalId,
        DisplayName = @DisplayName,
        Email = @Email
    WHERE Id = @Id;
END

