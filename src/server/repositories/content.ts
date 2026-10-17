import { db } from "@/server/db";
import { schemas, type Entity, type Portfolio } from "@/lib/content-schema";
const order = { displayOrder: "asc" as const };
export async function readPortfolio(): Promise<Portfolio> {
  const p = db();
  const [
    profile,
    projects,
    experience,
    skills,
    certifications,
    education,
    achievements,
    social,
    settings,
  ] = await p.$transaction([
    p.profile.findUnique({ where: { id: "owner" } }),
    p.project.findMany({
      orderBy: order,
      include: {
        technologies: { orderBy: order },
        sections: { orderBy: order },
        images: { orderBy: order },
      },
    }),
    p.experience.findMany({
      orderBy: order,
      include: { highlights: { orderBy: order } },
    }),
    p.skill.findMany({
      orderBy: order,
      include: { category: true, projects: { select: { id: true } } },
    }),
    p.certification.findMany({ orderBy: order }),
    p.education.findMany({ orderBy: order }),
    p.achievement.findMany({ orderBy: order }),
    p.socialLink.findMany({ orderBy: order }),
    p.siteSetting.findUnique({ where: { id: "site" } }),
  ]);
  if (!profile || !settings) throw new Error("Portfolio has not been seeded");
  return {
    profile: schemas.profile.parse(profile),
    settings: schemas.settings.parse(settings),
    projects: projects.map((v) =>
      schemas.projects.parse({
        ...v,
        technologies: v.technologies.map((t) => t.name),
      }),
    ),
    experience: experience.map((v) =>
      schemas.experience.parse({
        ...v,
        highlights: v.highlights.map((h) => h.text),
      }),
    ),
    skills: skills.map((v) =>
      schemas.skills.parse({
        ...v,
        category: v.category.name,
        projectIds: v.projects.map((p) => p.id),
      }),
    ),
    certifications: certifications.map((v) => schemas.certifications.parse(v)),
    education: education.map((v) => schemas.education.parse(v)),
    achievements: achievements.map((v) => schemas.achievements.parse(v)),
    social: social.map((v) => schemas.social.parse(v)),
  };
}
// All entry points must authorize before calling these internal repository functions.
export async function saveRecord(entity: Entity, input: unknown) {
  const p = db();
  switch (entity) {
    case "profile": {
      const { id: _, ...data } = schemas.profile.parse(input);
      return p.profile.upsert({
        where: { id: "owner" },
        create: { id: "owner", ...data },
        update: data,
      });
    }
    case "settings": {
      const { id: _, ...data } = schemas.settings.parse(input);
      return p.siteSetting.upsert({
        where: { id: "site" },
        create: { id: "site", ...data },
        update: data,
      });
    }
    case "projects": {
      const { id, technologies, sections, images, ...data } =
        schemas.projects.parse(input);
      const children = {
        technologies: {
          create: [...new Set(technologies)].map((name, displayOrder) => ({
            name,
            displayOrder,
          })),
        },
        sections: {
          create: sections.map((v, displayOrder) => ({ ...v, displayOrder })),
        },
        images: {
          create: images.map((v, displayOrder) => ({ ...v, displayOrder })),
        },
      };
      return p.$transaction(async (tx) => {
        if (!id) return tx.project.create({ data: { ...data, ...children } });
        await tx.projectTechnology.deleteMany({ where: { projectId: id } });
        await tx.projectSection.deleteMany({ where: { projectId: id } });
        await tx.projectImage.deleteMany({ where: { projectId: id } });
        return tx.project.upsert({
          where: { id },
          create: { id, ...data, ...children },
          update: { ...data, ...children },
        });
      });
    }
    case "experience": {
      const { id, highlights, ...data } = schemas.experience.parse(input);
      return p.$transaction(async (tx) => {
        if (id)
          await tx.experienceHighlight.deleteMany({
            where: { experienceId: id },
          });
        const nested = {
          ...data,
          highlights: {
            create: highlights.map((text, displayOrder) => ({
              text,
              displayOrder,
            })),
          },
        };
        return id
          ? tx.experience.upsert({
              where: { id },
              create: { id, ...nested },
              update: nested,
            })
          : tx.experience.create({ data: nested });
      });
    }
    case "skills": {
      const { id, category, projectIds, ...data } = schemas.skills.parse(input);
      const nested = {
        ...data,
        category: {
          connectOrCreate: {
            where: { name: category },
            create: { name: category },
          },
        },
        projects: { connect: projectIds.map((id) => ({ id })) },
      };
      return id
        ? p.skill.upsert({
            where: { id },
            create: { id, ...nested },
            update: {
              ...nested,
              projects: { set: projectIds.map((id) => ({ id })) },
            },
          })
        : p.skill.create({ data: nested });
    }
    case "certifications": {
      const { id, ...data } = schemas.certifications.parse(input);
      return id
        ? p.certification.upsert({
            where: { id },
            create: { id, ...data },
            update: data,
          })
        : p.certification.create({ data });
    }
    case "education": {
      const { id, ...data } = schemas.education.parse(input);
      return id
        ? p.education.upsert({
            where: { id },
            create: { id, ...data },
            update: data,
          })
        : p.education.create({ data });
    }
    case "achievements": {
      const { id, ...data } = schemas.achievements.parse(input);
      return id
        ? p.achievement.upsert({
            where: { id },
            create: { id, ...data },
            update: data,
          })
        : p.achievement.create({ data });
    }
    case "social": {
      const { id, ...data } = schemas.social.parse(input);
      return id
        ? p.socialLink.upsert({
            where: { id },
            create: { id, ...data },
            update: data,
          })
        : p.socialLink.create({ data });
    }
  }
}
export async function deleteRecord(entity: Entity, id: string) {
  const where = { id };
  const p = db();
  switch (entity) {
    case "projects":
      return p.project.delete({ where });
    case "experience":
      return p.experience.delete({ where });
    case "skills":
      return p.skill.delete({ where });
    case "certifications":
      return p.certification.delete({ where });
    case "education":
      return p.education.delete({ where });
    case "achievements":
      return p.achievement.delete({ where });
    case "social":
      return p.socialLink.delete({ where });
    default:
      throw new Error("Singleton records cannot be deleted");
  }
}
