// Polyfill for Object.hasOwn (for Node.js versions < 16.9.0)
if (!Object.hasOwn) {
  Object.defineProperty(Object, 'hasOwn', {
    value: function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    },
    configurable: true,
    enumerable: false,
    writable: true,
  });
}

require('dotenv').config();
const bcrypt = require('bcryptjs');
const app = require('./app');
const { sequelize, Admin } = require('./models');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      require('dotenv').config();
    }

    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models (create tables)
    await sequelize.sync({ alter: false });
    console.log('Database tables created.');

    // Create default admin if not exists
    const adminExists = await Admin.findOne({ where: { username: 'admin' } });

    if (!adminExists) {
      console.log('Creating default admin user...');
      const hashedPw = await bcrypt.hash('admin123', 10);

      await Admin.create({
        username: 'admin',
        email: 'admin@example.com',
        password_hash: hashedPw,
        role: 'super_admin',
      });

      console.log('Default admin created: admin / admin123');
    } else {
      // Ensure default admin is super_admin (fix for migration)
      if (adminExists.role !== 'super_admin') {
        adminExists.role = 'super_admin';
        await adminExists.save();
        console.log('Default admin role updated to super_admin');
      }
    }

    // Migration: Backfill Result.teacher_id from Exam.created_by
    const { Result, Exam, Op } = require('./models');
    const { Result: ResultModel, Exam: ExamModel } = require('./models');

    const resultsToUpdate = await ResultModel.findAll({
      where: { teacher_id: null },
      include: [{ model: ExamModel, as: 'exam' }],
    });

    if (resultsToUpdate.length > 0) {
      console.log(
        `Backfilling teacher_id for ${resultsToUpdate.length} results...`
      );
      for (const r of resultsToUpdate) {
        if (r.exam && r.exam.created_by) {
          r.teacher_id = r.exam.created_by;
          await r.save();
        }
      }
      console.log('Backfill completed.');
    }

    // Migration: Update legacy 'sub_admin' role to 'teacher'
    const adminsToUpdate = await Admin.findAll({
      where: { role: 'sub_admin' },
    });
    if (adminsToUpdate.length > 0) {
      console.log(
        `Migrating ${adminsToUpdate.length} users from sub_admin to teacher...`
      );
      for (const admin of adminsToUpdate) {
        admin.role = 'teacher';
        await admin.save();
      }
      console.log('Role migration completed.');
    }

    // Migration: Move existing teacher_id to StudentTeacher join table
    const { Student, StudentTeacher } = require('./models');
    const studentsWithTeacher = await Student.findAll({
      where: {
        teacher_id: { [Op.not]: null },
      },
    });

    if (studentsWithTeacher.length > 0) {
      console.log(
        `Migrating ${studentsWithTeacher.length} student-teacher relationships to join table...`
      );
      for (const student of studentsWithTeacher) {
        // Use findOrCreate to avoid duplicate errors
        await StudentTeacher.findOrCreate({
          where: {
            student_id: student.id,
            teacher_id: student.teacher_id,
          },
          defaults: {
            student_id: student.id,
            teacher_id: student.teacher_id,
          },
        });
      }
      console.log('Student-teacher relationship migration completed.');
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access the application at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
