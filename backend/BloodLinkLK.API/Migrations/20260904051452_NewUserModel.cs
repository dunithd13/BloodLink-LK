using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BloodLinkLK.API.Migrations
{
    /// <inheritdoc />
    public partial class NewUserModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "DonorAvailabilities");

            migrationBuilder.DropColumn(
                name: "UnitsRequired",
                table: "BloodRequests");

            migrationBuilder.RenameColumn(
                name: "AvailableDate",
                table: "DonorAvailabilities",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "RequiredDate",
                table: "BloodRequests",
                newName: "Deadline");

            migrationBuilder.RenameColumn(
                name: "Hospital",
                table: "BloodRequests",
                newName: "RequesterName");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "DonorAvailabilities",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAvailable",
                table: "DonorAvailabilities",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "DonorAvailabilities",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsEmergency",
                table: "BloodRequests",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "RequesterId",
                table: "BloodRequests",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    ContactNumber = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DonorAvailabilities_UserId",
                table: "DonorAvailabilities",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BloodRequests_RequesterId",
                table: "BloodRequests",
                column: "RequesterId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_BloodRequests_Users_RequesterId",
                table: "BloodRequests",
                column: "RequesterId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_DonorAvailabilities_Users_UserId",
                table: "DonorAvailabilities",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BloodRequests_Users_RequesterId",
                table: "BloodRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_DonorAvailabilities_Users_UserId",
                table: "DonorAvailabilities");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropIndex(
                name: "IX_DonorAvailabilities_UserId",
                table: "DonorAvailabilities");

            migrationBuilder.DropIndex(
                name: "IX_BloodRequests_RequesterId",
                table: "BloodRequests");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "DonorAvailabilities");

            migrationBuilder.DropColumn(
                name: "IsAvailable",
                table: "DonorAvailabilities");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "DonorAvailabilities");

            migrationBuilder.DropColumn(
                name: "IsEmergency",
                table: "BloodRequests");

            migrationBuilder.DropColumn(
                name: "RequesterId",
                table: "BloodRequests");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "DonorAvailabilities",
                newName: "AvailableDate");

            migrationBuilder.RenameColumn(
                name: "RequesterName",
                table: "BloodRequests",
                newName: "Hospital");

            migrationBuilder.RenameColumn(
                name: "Deadline",
                table: "BloodRequests",
                newName: "RequiredDate");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "DonorAvailabilities",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UnitsRequired",
                table: "BloodRequests",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
