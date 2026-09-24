<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'phone')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('phone')->nullable()->unique()->after('name');
            });
        }

        $administratorId = DB::table('users')
            ->where('role', 'admin')
            ->orderBy('id')
            ->value('id');

        if ($administratorId !== null) {
            DB::table('users')
                ->where('id', $administratorId)
                ->update(['phone' => '+77000880689']);
        }

        if (Schema::hasColumn('users', 'email')) {
            if (Schema::hasIndex('users', 'users_email_unique')) {
                Schema::table('users', function (Blueprint $table) {
                    $table->dropUnique('users_email_unique');
                });
            }

            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn(['email', 'email_verified_at']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable()->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->dropColumn('phone');
        });
    }
};
